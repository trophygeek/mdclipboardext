import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { htmlToMarkdown, markdownToCleanHtml } from "./utils";

import openIconSrc from "../public/openNewWindowIcon.svg";
import clearIconSrc from "../public/clearbutton.svg";
import appIconSrc from "../public/icon48.png";
import clearFormatIconSrc from "../public/clearFormattingIcon.svg";
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

  const handleConversion = async (
    targetFormat: "markdown" | "cleanHtml",
  ): Promise<void> => {
    try {
      const clipboardContents = await navigator.clipboard.read();

      let sourceMarkdown = "";
      let hasHtml = false;
      let hasMarkdownFromSession = false;

      // Extract HTML text if present
      const clipboardHtmlItem = clipboardContents.find((s) =>
        s.types.includes("text/html"),
      );
      if (clipboardHtmlItem) {
        const blob = await clipboardHtmlItem.getType("text/html");
        const htmlText = (await blob?.text()) ?? "";
        if (htmlText) {
          hasHtml = true;
          sourceMarkdown = htmlToMarkdown(htmlText);
        }
      }

      // If no valid HTML found, rely solely on our existing session state
      if (!hasHtml) {
        if (
          modifiedText.trim() &&
          modifiedText !== chrome.i18n.getMessage("notifyNoRichTextDetails") &&
          modifiedText !== chrome.i18n.getMessage("notifyNoTextDetails")
        ) {
          hasMarkdownFromSession = true;
          sourceMarkdown = modifiedText;
        } else {
          showNotificationMsg(chrome.i18n.getMessage("notifyNoRichText"));
          setModifiedText(chrome.i18n.getMessage("notifyNoRichTextDetails"));
          return;
        }
      }

      if (!sourceMarkdown.trim()) {
        showNotificationMsg(chrome.i18n.getMessage("notifyNoRichText"));
        setModifiedText(chrome.i18n.getMessage("notifyNoTextDetails"));
        return;
      }

      // 1. Text area should ONLY show markdown
      setModifiedText(sourceMarkdown);

      // 2. Output to clipboard based on targetFormat
      if (targetFormat === "markdown") {
        await navigator.clipboard.writeText(sourceMarkdown);
      } else {
        const cleanHtmlText = markdownToCleanHtml(sourceMarkdown);
        const outputBlob = new Blob([cleanHtmlText], { type: "text/html" });
        const plainBlob = new Blob([sourceMarkdown], { type: "text/plain" });
        const item = new ClipboardItem({
          "text/html": outputBlob,
          "text/plain": plainBlob,
        });
        await navigator.clipboard.write([item]);
      }

      chrome.storage.session.set({ currentMarkdown: sourceMarkdown }, () => {
        const successMessageKey =
          targetFormat === "markdown" ? "notifySuccess" : "notifySuccessHtml";
        showNotificationMsg(chrome.i18n.getMessage(successMessageKey));
        handleSave(sourceMarkdown);
      });
    } catch (err) {
      console.error("Failed to read/write clipboard:", err);
      showNotificationMsg(
        `${chrome.i18n.getMessage("notifyErrorPrefix")} ${err}.`,
      );
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
      <main className="main-content">
        <h1>{chrome.i18n.getMessage("popupTitle")}</h1>
        <p>{chrome.i18n.getMessage("popupSubtitle")}</p>
        <div className="split-action-bar">
          <button
            className="split-action-btn"
            onClick={() => handleConversion("cleanHtml")}
            title={chrome.i18n.getMessage("actionToCleanHtmlTooltip")}
          >
            <img
              src={clearFormatIconSrc}
              alt=""
              className="split-action-icon"
            />
            {chrome.i18n.getMessage("actionToCleanHtmlBtn") || "To Clean HTML"}
          </button>
          <button
            className="split-action-btn"
            onClick={() => handleConversion("markdown")}
            title={chrome.i18n.getMessage("actionToMarkdownTooltip")}
          >
            <img src={appIconSrc} alt="" className="split-action-icon" />
            {chrome.i18n.getMessage("actionToMarkdownBtn") || "To Markdown"}
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className="modifiedTextArea"
          value={modifiedText}
          readOnly
          placeholder={chrome.i18n.getMessage("modifiedTextPlaceholder")}
          rows={10}
          onMouseUp={handleMouseUp}
        />
      </main>
      <footer className="footer-actions">
        <button
          aria-label={chrome.i18n.getMessage("clearAria")}
          onClick={clearContentClick}
          className="iconbutton clear-btn"
        >
          <img src={clearIconSrc} className="iconbuttonsvg" alt="" />
          <span>{chrome.i18n.getMessage("clearBtn") || "Clear"}</span>
        </button>
        <button
          aria-label={chrome.i18n.getMessage("openEditorAria")}
          onClick={openOptionsClick}
          className="iconbutton pop-out-btn"
        >
          <img src={openIconSrc} className="iconbuttonsvg" alt="" />
          <span>{chrome.i18n.getMessage("popOutBtn") || "Pop-out"}</span>
        </button>
      </footer>
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
