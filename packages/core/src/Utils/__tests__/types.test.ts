// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import type { MergeHtmlProps } from "@/Utils/types";

describe("MergeHtmlProps", () => {
  test("it should merge own props with HTML attributes", () => {
    type Own = { label?: string };
    type Props = MergeHtmlProps<Own, { id?: string }>;

    const props: Props = { id: "field", label: "Name" };

    expect(props.id).toBe("field");
    expect(props.label).toBe("Name");
  });
});
