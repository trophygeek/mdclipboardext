import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Options } from "mdast-util-to-markdown";

import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import "./options.css";
import { gfmToMarkdown } from "mdast-util-gfm";

const toMarkdownOptions: Options = {
  bullet: "-",
  bulletOther: "+",
  emphasis: "_",
  extensions: [gfmToMarkdown()],
};

interface OptionsProps {
  // You can define props here if your options component needs them
}

const OptionsPage: React.FC<OptionsProps> = () => {
  const mdxeditorref = useRef<MDXEditorMethods>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recurrenceRef = useRef<boolean>(false);
  const [initialMarkdown, setInitialMarkdown] = useState<string | undefined>(
    undefined,
  );

  const getInitialMarkdown = async (): Promise<string | undefined> => {
    const data = await chrome.storage.session.get("currentMarkdown");
    if (data.currentMarkdown && typeof data.currentMarkdown === "string") {
      return data.currentMarkdown;
    }
    return undefined;
  };

  const loadSaved = async (): Promise<string | undefined> => {
    if (recurrenceRef.current) {
      return;
    }
    recurrenceRef.current = true;
    const data = await chrome.storage.session.get("currentMarkdown");
    if (data.currentMarkdown && typeof data.currentMarkdown === "string") {
      mdxeditorref.current?.setMarkdown(data.currentMarkdown);
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

  const handleInputChange = (value: string): void => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      handleSave(value);
    }, 500);
  };

  // Load initial markdown snapshot once on mount for diff comparison
  // This value is immutable after initial load - it represents the baseline for diffing
  useEffect(() => {
    let isMounted = true;
    getInitialMarkdown().then((markdown) => {
      if (isMounted && markdown !== undefined) {
        setInitialMarkdown(markdown);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Load and sync editor content with storage
  useEffect(() => {
    loadSaved();
    chrome.storage.session.onChanged.addListener(() => {
      if (!recurrenceRef.current) {
        // maybe we should confirm before reloading?
        loadSaved();
      }
    });
  }, []);

  const codeBlockLanguages: Record<string, string> = {
    "": "text",
    txt: "text",
    text: "text",

    js: "JavaScript",
    javascript: "JavaScript",
    jsx: "JSX",

    ts: "TypeScript",
    tsx: "TypeScript",
    typescript: "TypeScript",

    css: "CSS",
    scss: "SCSS",
    sass: "SASS",
    less: "Less",
    html: "HTML",
    xml: "XML",
    json: "JSON",
    json5: "JSON",
    yaml: "YAML",
    yml: "YAML",
    markdown: "Markdown",
    md: "Markdown",
    python: "Python",
    py: "Python",
    java: "Java",
    go: "Go",
    rust: "Rust",
    rs: "Rust",
    php: "PHP",
    ruby: "Ruby",
    rb: "Ruby",
    sh: "Shell",
    bash: "Bash",
    shell: "Shell",
    sql: "SQL",
    c: "C",
    cpp: "C++",
    cxx: "C++",
    cs: "C#",
    swift: "Swift",
    kotlin: "Kotlin",
    kt: "Kotlin",
    dart: "Dart",
    lua: "Lua",
    perl: "Perl",
    pl: "Perl",
    r: "R",
    scala: "Scala",
    dockerfile: "Dockerfile",
    makefile: "Makefile",
    graphql: "GraphQL",
    d: "D",
    powershell: "PowerShell",
  };
  
  const mdxTranslation = (key: string, defaultValue?: string): string => {
     // We sanitize the key because chrome.i18n keys must not contain dots usually, 
     // but mdxeditor keys look like 'toolbar.bold'. 
     // chrome.i18n allows dots, but let's be safe and ensure we map if needed.
     // For now, we try to fetch as is.
     
     // Note: chrome.i18n.getMessage returns "" on failure and sets runtime.lastError
     const sanitizedKey = key.replace(/\./g, "_");
     const translated = chrome.i18n.getMessage(sanitizedKey);
     if (translated) return translated;
     return defaultValue || key;
  };

  return (
    <main>
      <MDXEditor
        className="mdxeditor-fullscreen light-theme light-editor"
        ref={mdxeditorref}
        markdown={""}
        onChange={handleInputChange}
        translation={mdxTranslation}
        toMarkdownOptions={toMarkdownOptions}
        suppressHtmlProcessing={true}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <DiffSourceToggleWrapper>
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <CreateLink />
                  <ListsToggle />
                  <InsertThematicBreak />
                  <InsertImage />
                  <InsertTable />
                  <InsertCodeBlock />
                  {/*<ClearFormatting/>*/}
                  <CodeToggle />
                </DiffSourceToggleWrapper>
              </>
            ),
          }),

          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5] }),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({
            imageAutocompleteSuggestions: [
              chrome.runtime.getURL("placeholder1.png"),
              chrome.runtime.getURL("placeholder2.png"),
            ],
          }),
          tablePlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({
            autoLoadLanguageSupport: true,
            codeBlockLanguages: codeBlockLanguages,
          }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          diffSourcePlugin({
            diffMarkdown: initialMarkdown,
            viewMode: "source",
          }),
        ]}
      />
      <div className="powered-by-pillbox">
        {chrome.i18n.getMessage("poweredBy")}
      </div>
    </main>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<OptionsPage />);
}
