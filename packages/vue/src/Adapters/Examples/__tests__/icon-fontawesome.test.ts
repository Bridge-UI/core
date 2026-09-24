// ** External Imports
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { isObject } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Core Imports
import { SEMANTIC_ICON_NAMES } from "@bridge-ui/core/Adapters";

// ** Local Imports
import {
  createFontAwesomeIconAdapter,
  wrapFaIcon,
} from "@/Adapters/Examples/icon-fontawesome";

test("it should resolve every semantic icon name", () => {
  const adapter = createFontAwesomeIconAdapter();

  for (const name of SEMANTIC_ICON_NAMES) {
    expect(adapter.resolve(name)).toBeTruthy();
  }
});

test("it should wrap Font Awesome definitions via normalize", () => {
  const adapter = createFontAwesomeIconAdapter();
  const wrapped = adapter.normalize?.(faCoffee);

  expect(isObject(wrapped)).toBe(true);
  expect(wrapped).toBe(wrapFaIcon(faCoffee));
});
