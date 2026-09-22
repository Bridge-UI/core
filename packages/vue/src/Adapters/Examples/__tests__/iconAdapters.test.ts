// ** External Imports
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { describe, expect, test } from "vitest";

// ** Core Imports
import {
  SEMANTIC_ICON_NAMES,
  type IconAdapter,
} from "@bridge-ui/core/Adapters";

// ** Local Imports
import {
  createFontAwesomeIconAdapter,
  wrapFaIcon,
} from "@/Adapters/Examples/icon-fontawesome";
import { createHeroiconsIconAdapter } from "@/Adapters/Examples/icon-heroicons";
import { createLucideIconAdapter } from "@/Adapters/Examples/icon-lucide";
import { createPhosphorIconAdapter } from "@/Adapters/Examples/icon-phosphor";
import { createTablerIconAdapter } from "@/Adapters/Examples/icon-tabler";

const adapters: [string, IconAdapter][] = [
  ["lucide", createLucideIconAdapter()],
  ["heroicons", createHeroiconsIconAdapter()],
  ["tabler", createTablerIconAdapter()],
  ["phosphor", createPhosphorIconAdapter()],
  ["fontawesome", createFontAwesomeIconAdapter()],
];

describe.each(adapters)("%s icon adapter", (_name, adapter) => {
  test("it should resolve every semantic icon name", () => {
    for (const name of SEMANTIC_ICON_NAMES) {
      expect(adapter.resolve(name)).toBeTruthy();
    }
  });
});

test("it should wrap Font Awesome definitions via normalize", () => {
  const adapter = createFontAwesomeIconAdapter();
  const wrapped = adapter.normalize?.(faCoffee);

  expect(wrapped).toBe(wrapFaIcon(faCoffee));
  expect(typeof wrapped).toBe("object");
});
