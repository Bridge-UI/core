// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  setI18nAdapterForTests,
  useResolveMessage,
} from "@/Adapters/I18n/useI18nAdapter";

afterEach(() => {
  setI18nAdapterForTests(undefined);
});

function mountUseResolveMessage() {
  let resolveMessage!: ReturnType<typeof useResolveMessage>;

  const Wrapper = defineComponent({
    setup() {
      resolveMessage = useResolveMessage();

      return () => h("div");
    },
  });

  mount(Wrapper);

  return resolveMessage;
}

test("it should return the source message when no adapter is set", () => {
  const resolveMessage = mountUseResolveMessage();

  expect(resolveMessage("Hide password")).toBe("Hide password");
});

test("it should translate through the test i18n adapter", () => {
  setI18nAdapterForTests({
    t(message) {
      return message === "Close" ? "Fechar" : message;
    },
  });

  const resolveMessage = mountUseResolveMessage();

  expect(resolveMessage("Close")).toBe("Fechar");
  expect(resolveMessage("Show password")).toBe("Show password");
});

test("it should forward params to the adapter", () => {
  const seen: unknown[] = [];

  setI18nAdapterForTests({
    t(message, count, params) {
      seen.push({ count, params, message });

      return message;
    },
  });

  const resolveMessage = mountUseResolveMessage();

  resolveMessage("{{count}} item", { count: 3 });
  resolveMessage("{{count}} item", 3);

  expect(seen).toEqual([
    {
      count: undefined,
      params: { count: 3 },
      message: "{{count}} item",
    },
    { count: 3, params: undefined, message: "{{count}} item" },
  ]);
});
