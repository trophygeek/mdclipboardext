import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { htmlToMarkdown, isMarkdownText } from "./utils";

// @ts-expect-error - SVG imports not typed
import openIconSrc from "../public/openNewWindowIcon.svg";
// @ts-expect-error - SVG imports not typed
import clearIconSrc from "../public/clearbutton.svg";
import "./popup.css";

const Popup: React.FC = () => {
  const [modifiedText, setModifiedText] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const recurrenceRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chrome.storage.local.get("popup_textarea_height", (result) => {
      const height = result.popup_textarea_height;
      if (typeof height === "string" && textareaRef.current) {
        textareaRef.current.style.height = height;
      }
    });
  }, []);

  const handleMouseUp = (): void => {
    if (textareaRef.current && textareaRef.current.style.height) {
      chrome.storage.local.set({
        popup_textarea_height: textareaRef.current.style.height,
      });
    }
  };

  const showNotificationMsg = (msg: string): void => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Hide the notification after 3 seconds
  };

  const loadSaved = async (): Promise<string | undefined> => {
    if (recurrenceRef.current) {
      return;
    }
    recurrenceRef.current = true;
    const data = await chrome.storage.session.get("currentMarkdown");
    if (data.currentMarkdown && typeof data.currentMarkdown === "string") {
      setModifiedText(data.currentMarkdown);
      recurrenceRef.current = false;
      return data.currentMarkdown;
    }
    recurrenceRef.current = false;
    return undefined;
  };

  const handleSave = (value: string): void => {
    if (recurrenceRef.current) {
      return;
    }
    recurrenceRef.current = true;
    chrome.storage.session.set({ currentMarkdown: value }, () => {
      recurrenceRef.current = false;
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Loading initial state from storage
    loadSaved();
    chrome.storage.session.onChanged.addListener(() => {
      if (!recurrenceRef.current) {
        // maybe we should confirm before reloading?
        loadSaved();
      }
    });
  }, []);

  const handleCopyModifyPaste = async (): Promise<void> => {
    try {
      const clipboardContents = await navigator.clipboard.read();

      // Helper function to handle markdown display (without clipboard write)
      const displayMarkdown = (markdownText: string): void => {
        setModifiedText(markdownText);
        chrome.storage.session.set({ currentMarkdown: markdownText }, () => {
          showNotificationMsg(
            "Markdown detected in clipboard. Click button in upper right to edit.",
          );
          handleSave(markdownText);
        });
      };

      // Check for markdown MIME types first
      const markdownItem = clipboardContents.find(
        (s) =>
          s.types.includes("text/markdown") ||
          s.types.includes("text/x-markdown"),
      );
      if (markdownItem) {
        const markdownType =
          markdownItem.types.find((t) => t.includes("markdown")) ??
          "text/plain";
        const blob = await markdownItem.getType(markdownType);
        const markdownText = (await blob?.text()) ?? "";
        if (markdownText) {
          displayMarkdown(markdownText);
          return;
        }
      }

      // Check for HTML
      const clipboardItem = clipboardContents.find((s) =>
        s.types.includes("text/html"),
      );
      if (!clipboardItem) {
        // Check if plain text is markdown
        const plainTextItem = clipboardContents.find((s) =>
          s.types.includes("text/plain"),
        );
        if (plainTextItem) {
          const blob = await plainTextItem.getType("text/plain");
          const plainText = (await blob?.text()) ?? "";
          if (plainText && isMarkdownText(plainText)) {
            displayMarkdown(plainText);
            return;
          }
        }
        showNotificationMsg(
          "No rich text found in clipboard. Already converted?",
        );
        return;
      }
      const blob = await clipboardItem.getType("text/html");
      const htmlText = (await blob?.text()) ?? "";

      if (htmlText === "") {
        showNotificationMsg("No rich text found in clipboard.");
        setModifiedText(
          "Only plain text found in clipboard. Copy rich text from a web page or document first.",
        );
        return;
      }

      // --- Convert HTML to Markdown ---
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
        showNotificationMsg(
          "Clipboard updated successfully and added to clipboard.",
        );
        handleSave(markdownText);
      });
    } catch (err) {
      console.error("Failed to read/write clipboard:", err);
      showNotificationMsg(`Was not able to process clipboard. ${err}.`);
    }
  };

  const openOptionsClick = (): void => {
    chrome.runtime.openOptionsPage();
  };

  const clearContentClick = (): void => {
    setModifiedText("");
    handleSave("");
  };

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
        ref={textareaRef}
        className="modifiedTextArea"
        value={modifiedText}
        readOnly
        placeholder={chrome.i18n.getMessage("modifiedTextPlaceholder")}
        rows={10}
        onMouseUp={handleMouseUp}
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
      <div className={`notification ${showNotification ? "show" : "hide"}`}>
        {notificationMessage}
      </div>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<Popup />);
}
console.log("popup.tsx loaded and executed");
