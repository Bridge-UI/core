// ** External Imports
import { createRawSnippet } from "svelte";

/**
 * Snippet that renders `text` in a `<span>`, for passing `children` / named
 * snippets from `.ts` tests.
 */
export function textSnippet(text: string) {
  return createRawSnippet(() => {
    return {
      render: () => `<span>${text}</span>`,
    };
  });
}
