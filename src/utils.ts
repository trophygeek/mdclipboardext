import { fromHtml } from "hast-util-from-html";
import { toMarkdown } from "mdast-util-to-markdown";
import { toMdast } from "hast-util-to-mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmToMarkdown, gfmFromMarkdown } from "mdast-util-gfm";
import { directive } from "micromark-extension-directive";
import {
  directiveFromMarkdown,
  directiveToMarkdown,
} from "mdast-util-directive";

/**
 * Converts an HTML string to Markdown.
 * Includes support for GFM and Directives (Admonitions) to ensure
 * compatibility with MDXEditor's rich text features.
 *
 * @param htmlString The HTML string to convert.
 * @returns The Markdown representation of the HTML.
 */
export function htmlToMarkdown(htmlString: string): string {
  if (!htmlString || htmlString.trim() === "") {
    return "";
  }

  // Parse HTML into HAST (Hypertext Abstract Syntax Tree)
  const hast = fromHtml(htmlString, { fragment: true });

  // Transform HAST to MDAST (Markdown Abstract Syntax Tree)
  const mdast = toMdast(hast);

  // Serialize MDAST to Markdown string
  const markdown = toMarkdown(mdast, {
    extensions: [gfmToMarkdown(), directiveToMarkdown()],
    bullet: "-",
    ruleSpaces: true,
  });

  return markdown;
}

/**
 * Heuristic check to determine if text is likely Markdown.
 * * It checks if the parsed AST contains structural elements beyond a single
 * plain text paragraph (e.g., headings, lists, code blocks, or inline links/formatting).
 * * @param text The string to check.
 * @returns true if the text contains structural Markdown elements.
 */
export function isMarkdownText(text: string): boolean {
  // Ignore empty or extremely short strings that can't be meaningful MD
  if (!text || text.trim().length < 3) {
    return false;
  }

  try {
    // Parse using the same extensions used for conversion to ensure consistency
    const tree = fromMarkdown(text, {
      extensions: [directive()],
      mdastExtensions: [gfmFromMarkdown(), directiveFromMarkdown()],
    });

    // Heuristic: Does the AST contain anything more complex than a plain paragraph?
    const hasMarkdownStructures = tree.children.some((node) => {
      // Non-paragraph nodes (Heading, List, Table, Code, etc.) are definitive
      if (node.type !== "paragraph") {
        return true;
      }

      // If it is a paragraph, check children for inline formatting (Link, Strong, Emphasis, etc.)
      if ("children" in node && Array.isArray(node.children)) {
        return node.children.some(
          (child) => child.type !== "text" && child.type !== "break",
        );
      }
      return false;
    });

    return hasMarkdownStructures;
  } catch (error) {
    // If the parser fails, assume it's not valid/standard Markdown
    console.log(error);
    return false;
  }
}
