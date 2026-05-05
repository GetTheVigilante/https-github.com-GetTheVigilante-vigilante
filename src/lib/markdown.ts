/**
 * Lazy-load markdown parsing to reduce initial bundle
 * Only imports when explicitly called
 */

let markedModule: typeof import("marked") | null = null;
let highlightModule: typeof import("highlight.js") | null = null;

export const parseMarkdown = async (markdown: string): Promise<string> => {
  // Dynamically import only when needed
  if (!markedModule) {
    markedModule = await import("marked");
  }

  return markedModule.marked(markdown);
};

export const highlightCode = async (
  code: string,
  language?: string
): Promise<string> => {
  if (!highlightModule) {
    highlightModule = await import("highlight.js");
  }

  if (language) {
    return highlightModule.default.highlight(code, {
      language,
      ignoreIllegals: true,
    }).value;
  }

  return highlightModule.default.highlightAuto(code).value;
};