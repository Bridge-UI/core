// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import {
  toDateFormValues,
  toDateTimeFormValues,
  toRichTextFormValues,
  toTimeFormValues,
} from "@/Domain/formValue";

const adapter = createNativeDateAdapter();

const timeZone = "UTC";

const start = new Date("2024-03-05T09:07:03Z");
const end = new Date("2024-12-25T18:30:45Z");

describe("toDateFormValues", () => {
  test("it should serialize by granularity", () => {
    expect(toDateFormValues(adapter, start, { timeZone })).toEqual([
      "2024-03-05",
    ]);
    expect(
      toDateFormValues(adapter, start, { timeZone, granularity: "year" }),
    ).toEqual(["2024"]);
    expect(
      toDateFormValues(adapter, start, { timeZone, granularity: "month" }),
    ).toEqual(["2024-03"]);
  });

  test("it should return one entry per date in a range or list", () => {
    expect(toDateFormValues(adapter, null)).toEqual([]);
    expect(toDateFormValues(adapter, [start, end], { timeZone })).toEqual([
      "2024-03-05",
      "2024-12-25",
    ]);
  });
});

describe("toTimeFormValues", () => {
  test("it should serialize HH:mm with optional seconds", () => {
    expect(toTimeFormValues(adapter, start, { timeZone })).toEqual(["09:07"]);
    expect(
      toTimeFormValues(adapter, [start, end], { timeZone, showSeconds: true }),
    ).toEqual(["09:07:03", "18:30:45"]);
  });
});

describe("toDateTimeFormValues", () => {
  test("it should serialize like datetime-local", () => {
    expect(toDateTimeFormValues(adapter, start, { timeZone })).toEqual([
      "2024-03-05T09:07",
    ]);
    expect(
      toDateTimeFormValues(adapter, end, { timeZone, showSeconds: true }),
    ).toEqual(["2024-12-25T18:30:45"]);
  });
});

describe("toRichTextFormValues", () => {
  test("it should submit HTML as is and JSON as a string", () => {
    const doc = { type: "doc", content: [] };

    expect(toRichTextFormValues(null)).toEqual([]);
    expect(toRichTextFormValues("<p>Hi</p>")).toEqual(["<p>Hi</p>"]);
    expect(toRichTextFormValues(doc)).toEqual([JSON.stringify(doc)]);
  });
});
