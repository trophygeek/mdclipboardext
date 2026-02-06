# mdclipboardext - Markdown Clipboard Chrome Extension

This project is really just a Chrome Extension wrapper on other open source projects:

- [MDXEditor](https://github.com/mdx-editor/editor)
- [mdast-util-to-markdown](https://github.com/syntax-tree/mdast-util-from-markdown)

## Security first design

A core aspect is maintaining privacy:

- No script running in the background
- No injected context script therefore access to any page content
- No access to urls or browser history
- No network communications allowed (via Content Security Policy's `connect-src 'none'`)
- ONLY clipboard access extension is actively being used
- Storage uses temporary Session based via `chrome.storage.session`

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

- **Manifest V3:** Uses the latest Chrome Extension manifest version.
- **TypeScript:** Strongly typed language for safer and more maintainable code.
- **Vite:** Extremely fast build tool for rapid development.
- **Yarn:** Fast and reliable package manager.
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
    git clone https://github.com/trophygeek/mdclipboardext
    cd mdclipboardext
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
