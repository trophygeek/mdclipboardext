import React from "react";
import "./WelcomeModal.css";
// @ts-expect-error - SVG imports not typed
import richTextIcon from "../public/mode-rich-text.svg";
// @ts-expect-error - SVG imports not typed
import diffIcon from "../public/mode-diff.svg";
// @ts-expect-error - SVG imports not typed
import markdownIcon from "../public/mode-markdown.svg";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEmpty: boolean;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  isEmpty,
}) => {
  if (!isOpen) return null;

  return (
    <div className="welcome-modal-backdrop" onClick={onClose}>
      <div className="welcome-modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="welcome-title">{chrome.i18n.getMessage("welcomeModalTitle")}</h2>
        
        <div className="welcome-content">
          <p className="welcome-intro">
            {isEmpty
              ? chrome.i18n.getMessage("welcomeIntroEmpty")
              : chrome.i18n.getMessage("welcomeIntroContent")}
          </p>

          <div className="welcome-section">
            <h3>{chrome.i18n.getMessage("welcomeEditorModesTitle")}</h3>
            <p>
              {chrome.i18n.getMessage("welcomeEditorModesIntro")}
            </p>
            <ul className="mode-list">
              <li>
                <span className="mode-icon">
                  <img src={richTextIcon} alt={chrome.i18n.getMessage("modeRichTextAlt")} />
                </span>
                <strong>{chrome.i18n.getMessage("modeRichTextLabel")}</strong> {chrome.i18n.getMessage("modeRichTextDesc")}
              </li>
              <li>
                <span className="mode-icon">
                  <img src={diffIcon} alt={chrome.i18n.getMessage("modeDiffAlt")} />
                </span>
                <strong>{chrome.i18n.getMessage("modeDiffLabel")}</strong> {chrome.i18n.getMessage("modeDiffDesc")}
              </li>
              <li>
                <span className="mode-icon">
                  <img src={markdownIcon} alt={chrome.i18n.getMessage("modeMarkdownAlt")} />
                </span>
                <strong>{chrome.i18n.getMessage("modeMarkdownLabel")}</strong> {chrome.i18n.getMessage("modeMarkdownDesc")}
              </li>
            </ul>
          </div>

          <div className="welcome-section">
             <h3>{chrome.i18n.getMessage("welcomePersistenceTitle")}</h3>
             <p>
               {chrome.i18n.getMessage("welcomePersistencePart1")} <strong>{chrome.i18n.getMessage("welcomePersistencePart2")}</strong>{chrome.i18n.getMessage("welcomePersistencePart3")}
             </p>
          </div>
        </div>

        <div className="welcome-footer">
          <button className="welcome-button" onClick={onClose}>
            {chrome.i18n.getMessage("welcomeGetStartedBtn")}
          </button>
          
          <div className="welcome-footer-link">
             {chrome.i18n.getMessage("welcomePoweredByPrefix")} <a href="https://github.com/mdx-editor" target="_blank" rel="noreferrer">MDXEditor</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
