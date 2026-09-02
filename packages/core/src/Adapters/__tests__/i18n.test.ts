// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  interpolateMessage,
  resolveMessage,
  selectPluralMessage,
  type I18nAdapter,
} from "@/Adapters/i18n";

describe("resolveMessage", () => {
  const adapter: I18nAdapter = {
    t(message) {
      if (message === "Close") {
        return "Fechar";
      }

      return message;
    },
  };

  test("it should resolve via the adapter when provided", () => {
    expect(resolveMessage("Close", adapter)).toBe("Fechar");
  });

  test("it should return the source message without an adapter", () => {
    expect(resolveMessage("Hide password")).toBe("Hide password");
  });

  test("it should interpolate params without an adapter", () => {
    expect(
      resolveMessage("Page {{page}} of {{count}}", undefined, {
        page: 1,
        count: 7,
      }),
    ).toBe("Page 1 of 7");
  });

  test("it should pick pipe forms when count is set without an adapter", () => {
    const message =
      "{{selected}} of {{total}} row selected. | {{selected}} of {{total}} rows selected.";

    expect(
      resolveMessage(message, undefined, 1, { total: 2, selected: 1 }),
    ).toBe("1 of 2 row selected.");
    expect(
      resolveMessage(message, undefined, 2, { total: 68, selected: 2 }),
    ).toBe("2 of 68 rows selected.");
  });

  test("it should interpolate after a dictionary lookup", () => {
    const dictionary: I18nAdapter = {
      t(message, _count, params) {
        const catalog = {
          "Page {{page}} of {{count}}": "Página {{page}} de {{count}}",
        };
        const text = catalog[message] ?? message;

        return interpolateMessage(text, params);
      },
    };

    expect(
      resolveMessage("Page {{page}} of {{count}}", dictionary, {
        page: 1,
        count: 7,
      }),
    ).toBe("Página 1 de 7");
  });

  test("it should pick dictionary pipe forms from count", () => {
    const source = "{{selected}} of {{total}} row(s) selected.";
    const dictionary: I18nAdapter = {
      t(message, count, params) {
        const catalog = {
          [source]:
            "{{selected}} de {{total}} linha selecionada. | {{selected}} de {{total}} linhas selecionadas.",
        };
        const translated = catalog[message] ?? message;
        const template =
          count === undefined
            ? translated
            : selectPluralMessage(translated, count);

        return interpolateMessage(template, params);
      },
    };

    expect(
      resolveMessage(source, dictionary, 1, { total: 2, selected: 1 }),
    ).toBe("1 de 2 linha selecionada.");
    expect(
      resolveMessage(source, dictionary, 2, { total: 68, selected: 2 }),
    ).toBe("2 de 68 linhas selecionadas.");
  });

  test("it should forward count and params to the adapter", () => {
    const seen: unknown[] = [];
    const tracking: I18nAdapter = {
      t(message, count, params) {
        seen.push({ count, params, message });

        return message;
      },
    };

    resolveMessage("Hello {{name}}", tracking, 2, { name: "Bridge" });

    expect(seen).toEqual([
      {
        count: 2,
        message: "Hello {{name}}",
        params: { name: "Bridge" },
      },
    ]);
  });
});

describe("selectPluralMessage", () => {
  const two =
    "{{selected}} de {{total}} linha selecionada. | {{selected}} de {{total}} linhas selecionadas.";

  test("it should pick one | other", () => {
    expect(selectPluralMessage(two, 1)).toBe(
      "{{selected}} de {{total}} linha selecionada.",
    );
    expect(selectPluralMessage(two, 0)).toBe(
      "{{selected}} de {{total}} linhas selecionadas.",
    );
    expect(selectPluralMessage(two, 2)).toBe(
      "{{selected}} de {{total}} linhas selecionadas.",
    );
  });

  test("it should pick zero | one | other", () => {
    expect(selectPluralMessage("none | one | many", 0)).toBe("none");
    expect(selectPluralMessage("none | one | many", 1)).toBe("one");
    expect(selectPluralMessage("none | one | many", 4)).toBe("many");
  });

  test("it should return the template when there is no pipe", () => {
    expect(
      selectPluralMessage("{{selected}} of {{total}} row(s) selected.", 2),
    ).toBe("{{selected}} of {{total}} row(s) selected.");
  });
});

describe("interpolateMessage", () => {
  test("it should replace named tokens", () => {
    expect(
      interpolateMessage("{{selected}} of {{total}} row(s) selected.", {
        total: 68,
        selected: 2,
      }),
    ).toBe("2 of 68 row(s) selected.");
  });

  test("it should leave unknown tokens in place", () => {
    expect(interpolateMessage("Hello {{name}}", { other: true })).toBe(
      "Hello {{name}}",
    );
  });
});
