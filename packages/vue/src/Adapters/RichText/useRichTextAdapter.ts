// ** External Imports
import { computed, type ComputedRef } from "vue";

// ** Core Imports
import type { RichTextEditorAdapter } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

let richTextAdapterForTests: undefined | RichTextEditorAdapter;

/**
 * Sets a process-wide rich-text adapter fallback. For tests only.
 */
export function setRichTextAdapterForTests(
  adapter: undefined | RichTextEditorAdapter,
) {
  richTextAdapterForTests = adapter;
}

/**
 * Returns the active rich-text adapter from {@link BridgeUIProvider}.
 * `RichTextEditor` requires `global.richText` (e.g.
 * `@bridge-ui/vue/Adapters/Examples/rich-text-tiptap`).
 */
export function useRichTextAdapter(): ComputedRef<
  undefined | RichTextEditorAdapter
> {
  const bridge = useBridgeUI();

  return computed(() => {
    return bridge?.global.value.richText ?? richTextAdapterForTests;
  });
}
