// ** External Imports
import { expect, test } from "vitest";

// ** Core Imports
import { SEMANTIC_ICON_NAMES } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { createPhosphorIconAdapter } from "@/Adapters/Examples/icon-phosphor";

test("it should resolve every semantic icon name", () => {
  const adapter = createPhosphorIconAdapter();

  for (const name of SEMANTIC_ICON_NAMES) {
    expect(adapter.resolve(name)).toBeTruthy();
  }
});
