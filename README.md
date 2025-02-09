# PromptMark Extension



This project is really just a Chrome Extension wrapper on other open source projects:
- [MDXEditor](https://github.com/mdx-editor/editor)
- [mdast-util-to-markdown](https://github.com/syntax-tree/mdast-util-from-markdown)


## Security first design
A core aspect is maintaining privacy:
- No background script
- No injected context script
- No access to any page content
- No access to urls or history
- No network communications allowed (via Content Security Policy's `connect-src 'none'`)
- Storage temporary Session storage via `chrome.storage.session`  

```js
 "permissions": [
    "storage",
    "clipboardRead",
    "clipboardWrite"
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline';  font-src 'self'; img-src 'self' https:; connect-src 'none'"
  }
```

## Tech stack

- **TypeScript:** Strongly typed language for safer and more maintainable code.
- **Vite:** Extremely fast build tool for rapid development.
- **Yarn:** Fast and reliable package manager.
- **Manifest V3:** Uses the latest Chrome Extension manifest version.
- **Popup:** A simple popup that appears when the extension icon is clicked.
- **Options Page:** A dedicated page for user settings and configuration.
- **Linting (ESLint):** Ensures code quality and consistency.
- **Formatting (Prettier):** Automates code formatting.

## Prerequisites

- Node.js (LTS recommended)
- Yarn

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd chrome-extension-starter-ts-vite
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Build the extension:**

    ```bash
    yarn build
    ```

4.  **Load the extension in Chrome:**
    - Open Chrome and go to `chrome://extensions/`.
    - Enable "Developer mode" (top right corner).
    - Click "Load unpacked".
    - Select the `dist` folder inside your project directory.

## Development

- **Development Build:**

  ```bash
  yarn dev
  ```

  This starts Vite's development server with hot module replacement (HMR). Changes to your code will automatically reload the extension. You _must_ still click the "reload" button on the extension in `chrome://extensions/` after the build completes to see your changes. This is a limitation of the Chrome extension development process.

- **Production Build:**

  ```bash
  yarn build
  ```

  This creates a production-ready build in the `dist` folder.

## Scripts

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the extension for production.
- `yarn lint`: Runs ESLint to check for code style issues.
- `yarn format`: Formats the code using Prettier.
- `yarn format:check`: Checks if the code is formatted correctly, but doesn't modify any files.

## File Structure

- `public/manifest.json`: The extension's manifest file.
- `src/popup.tsx`: Contains the popup's HTML, CSS, and TypeScript files.
- `src/options.tsx`: Contains the MDXEditor
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration.
- `.eslintrc.cjs`: ESLint configuration.
- `.prettierrc.json`: Prettier configuration.

## Customization

- **Manifest:** Modify `public/manifest.json` to change the extension's name, description, icons, and permissions.
- **Background Worker:** Add your background logic to `src/background.ts`.
- **Popup:** Customize the popup's UI and functionality in `src/popup/`.
- **Options Page:** Customize the options page's UI and functionality in `src/options/`.
- **Content Scripts:** Add or modify content scripts in `src/` to interact with specific web pages.
