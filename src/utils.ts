// utils.ts

import {fromHtml} from 'hast-util-from-html';
import {toMarkdown} from 'mdast-util-to-markdown';
import {toMdast} from 'hast-util-to-mdast';
import {gfmToMarkdown} from "mdast-util-gfm";


/**
 * Converts an HTML string to Markdown using remark and a comprehensive set of plugins.
 *
 * @param htmlString The HTML string to convert.
 * @returns The Markdown representation of the HTML, or an error message.
 * @throws Errors!
 */
export function htmlToMarkdown(htmlString: string) {
  const hast = fromHtml(htmlString, {fragment: true});
  const mdast = toMdast(hast);
  return toMarkdown(mdast, {
    extensions: [
      gfmToMarkdown(),
    ]
  });
}

