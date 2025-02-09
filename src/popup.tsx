import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { htmlToMarkdown } from "./utils";

// @ts-ignore
import openIconSrc from "../public/openNewWindowIcon.svg";
import "./popup.css";

const Popup: React.FC = () => {
  const [modifiedText, setModifiedText] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showNotificationMsg = (msg: string) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Hide the notification after 3 seconds
  };


  const handleCopyModifyPaste = async () => {
    try {
      const clipboardContents = await navigator.clipboard.read();
      const clipboardItem = clipboardContents.find((s) =>
        s.types.includes("text/html"),
      );
      if (!clipboardItem) {
        // it's already text, do nothing. Notify?
        return;
      }
      const blob = await clipboardItem.getType("text/html");
      const htmlText = await blob?.text() ?? "";

      if (htmlText === "") {
        setModifiedText(
          "No text found in clipboard. Copy rich text from a web page or document first.",
        );
        return;
      }

      // --- Modify the text (Example: convert to uppercase) ---
      const markdownText = htmlToMarkdown(htmlText);
      if (markdownText === "") {
        setModifiedText(
          "No text found in clipboard. Copy rich text from a web page or document first.",
        );
        return;
      }

      setModifiedText(markdownText);
      await navigator.clipboard.writeText(markdownText);
      chrome.storage.session.set({ currentMarkdown: markdownText }, () => {
        showNotificationMsg("Clipboard updated successfully. Paste to see results.");
      });
    } catch (err) {
      console.error("Failed to read/write clipboard:", err);
      alert("Failed to access clipboard. Check permissions.");
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-container">
      <h1>PromptMark</h1>
      <p>Converts rich text in your clipboard to AI prompt friendly format.</p>
      <div className="floating-button-container">
        <button
          aria-label="Open editor in new tab"
          onClick={openOptions}
          className="iconbutton"
        >
          <img src={openIconSrc} />
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
      <div className={`notification ${showNotification ? 'show' : 'hide'}`}>{notificationMessage}</div>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<Popup />);
}
console.log("popup.tsx loaded and executed");
