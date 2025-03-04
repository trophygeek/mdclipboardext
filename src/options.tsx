import React, {useEffect, useRef} from "react";
import ReactDOM from "react-dom/client";
import {Options} from "mdast-util-to-markdown";

import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin, codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper, directivesPlugin,
  headingsPlugin,
  imagePlugin,
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
import {gfmToMarkdown} from "mdast-util-gfm";

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
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recurrenceRef = useRef<boolean>(false);

  useEffect(() => {
    loadSaved();
    chrome.storage.session.onChanged.addListener(() => {
      if (!recurrenceRef.current) {
        // maybe we should confirm before reloading?
        loadSaved();
      }
    });
  }, [mdxeditorref]);

  const handleInputChange = (value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(async () => {
      handleSave(value);
    }, 250);
  };

  const loadSaved = async () => {
    if (recurrenceRef.current) {
      return;
    }
    recurrenceRef.current = true;
    const data = await chrome.storage.session.get("currentMarkdown");
    // eslint-disable-next-line no-debugger
    if (data.currentMarkdown) {
      mdxeditorref.current?.setMarkdown(data.currentMarkdown);
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

  return (
      <main>
        <MDXEditor
            className="mdxeditor-fullscreen light-theme light-editor"
            ref={mdxeditorref}
            markdown={""}
            onChange={handleInputChange}
            toMarkdownOptions={toMarkdownOptions}
            suppressHtmlProcessing={true}
            plugins={[
              toolbarPlugin({
                              toolbarContents: () => (
                                  <>
                                    <DiffSourceToggleWrapper>
                                      <BlockTypeSelect/>
                                      <BoldItalicUnderlineToggles/>
                                      <CreateLink/>
                                      <ListsToggle/>
                                      <InsertThematicBreak/>
                                      <InsertImage/>
                                      <InsertTable/>
                                      {/*<ClearFormatting/>*/}
                                      <CodeToggle/>
                                    </DiffSourceToggleWrapper>
                                  </>
                              ),
                            }),
              diffSourcePlugin({
                                 viewMode: "source",
                                 readOnlyDiff: true,
                               }),


              listsPlugin(),
              quotePlugin(),
              headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5] }),
              linkPlugin(),
              linkDialogPlugin(),
              imagePlugin({ imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'] }),
              tablePlugin(),
              thematicBreakPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
              codeMirrorPlugin({
                                 codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' }
                               }),
              directivesPlugin({ directiveDescriptors: [ AdmonitionDirectiveDescriptor] }),
              diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
            ]}
        />
      </main>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<OptionsPage/>);
}
