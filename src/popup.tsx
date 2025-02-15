import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom/client";
import { htmlToMarkdown } from "./utils";

// @ts-ignore
import openIconSrc from "../public/openNewWindowIcon.svg";
// @ts-ignore
import clearIconSrc from "../public/clearbutton.svg";
import "./popup.css";

const Popup: React.FC = () => {
  const [modifiedText, setModifiedText] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const recurrenceRef = useRef<boolean>(false);

  const showNotificationMsg = (msg: string) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Hide the notification after 3 seconds
  };

  useEffect(() => {
    loadSaved();
    chrome.storage.session.onChanged.addListener(() => {
      if (!recurrenceRef.current) {
        // maybe we should confirm before reloading?
        loadSaved();
      }
    });
  }, []);

  const loadSaved = async () => {
    if (recurrenceRef.current) {
      return;
    }
    recurrenceRef.current = true;
    const data = await chrome.storage.session.get("currentMarkdown");
    // eslint-disable-next-line no-debugger
    if (data.currentMarkdown) {
      setModifiedText(data.currentMarkdown);
    }
    recurrenceRef.current = false;
    return data.currentMarkdown;
  };

  const handleSave = (value: string) => {
    if (recurrenceRef.current) {
      return;
    }
    recurrenceRef.current = true;
    chrome.storage.session.set({currentMarkdown: value}, () => {
      recurrenceRef.current = false;
    });
  };

  const handleCopyModifyPaste = async () => {
    try {
      const clipboardContents = await navigator.clipboard.read();
      const clipboardItem = clipboardContents.find((s) =>
        s.types.includes("text/html"),
      );
      if (!clipboardItem) {
        showNotificationMsg("No rich text found in clipboard. Already converted?");
        return;
      }
      const blob = await clipboardItem.getType("text/html");
      const htmlText = await blob?.text() ?? "";

      if (htmlText === "") {
        showNotificationMsg("No rich text found in clipboard.");
        setModifiedText(
          "Only plain text found in clipboard. Copy rich text from a web page or document first.",
        );
        return;
      }

      // --- Modify the text (Example: convert to uppercase) ---
      const markdownText = htmlToMarkdown(htmlText);
      if (markdownText === "") {
        showNotificationMsg("No rich text found in clipboard.");
        setModifiedText(
          "No text found in clipboard. Copy rich text from a web page or document first.",
        );
        return;
      }

      setModifiedText(markdownText);
      await navigator.clipboard.writeText(markdownText);
      chrome.storage.session.set({ currentMarkdown: markdownText }, () => {
        showNotificationMsg("Clipboard updated successfully. Paste to see results.");
        handleSave(markdownText);
      });
    } catch (err) {
      console.error("Failed to read/write clipboard:", err);
      showNotificationMsg(`Was not able to process clipboard. ${err}.`);
    }
  };

  const openOptionsClick = () => {
    chrome.runtime.openOptionsPage();
  };

  const clearContentClick = () => {
    setModifiedText("");
    handleSave("");
  }

  return (
    <div className="popup-container">
      <h1>Markdown for AI prompts</h1>
      <p>Converts rich text in your clipboard to AI prompt friendly format.</p>
      <div className="floating-button-container">
        <button
          aria-label="Open editor in new tab"
          onClick={openOptionsClick}
          className="iconbutton"
        >
          <img src={openIconSrc} className="iconbuttonsvg" />
        </button>
      </div>
      <button onClick={handleCopyModifyPaste}>Modify Clipboard</button>
      <textarea
        className="modifiedTextArea"
        value={modifiedText}
        readOnly
        placeholder="Modified text will appear here"
        rows={10}
      />
      <div className="floating-button-container-bottom">
        <button
            aria-label="Clear"
            onClick={clearContentClick}
            className="iconbutton"
        >
          <img src={clearIconSrc} className="iconbuttonsvg" />
        </button>
      </div>
      <div className={`notification ${showNotification ? 'show' : 'hide'}`}>{notificationMessage}</div>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<Popup />);
}
console.log("popup.tsx loaded and executed");
