// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useTextarea } from "@/Components/Textarea";

test("it should default autosize to false", () => {
  const { result } = renderHook(() => useTextarea({}));

  expect(result.current.textareaBind.className).not.toContain(
    "overflow-hidden",
  );
});

test("it should enable autosize by default when likeInput is true", () => {
  const { result } = renderHook(() => useTextarea({ likeInput: true }));

  expect(result.current.textareaBind.className).toContain("overflow-hidden");
});

test("it should use textarea control tokens", () => {
  const { result } = renderHook(() => useTextarea({}));

  expect(result.current.formField.control).toBe("textarea");
  expect(result.current.formField.inputBind.className).toContain("py-2");
});

test("it should apply resize-none when autosize is true", () => {
  const { result } = renderHook(() => useTextarea({ autosize: true }));

  expect(result.current.textareaBind.className).toContain("resize-none");
});

test("it should apply vertical resize class when resize is vertical", () => {
  const { result } = renderHook(() => useTextarea({ resize: "vertical" }));

  expect(result.current.textareaBind.className).toContain("resize-y");
});

test("it should default rows to 1 when likeInput is true", () => {
  const { result } = renderHook(() => useTextarea({ likeInput: true }));

  expect(result.current.textareaBind.rows).toBe(1);
});

test("it should set aria-invalid when error is true", () => {
  const { result } = renderHook(() => useTextarea({ error: true }));

  expect(result.current.formField.inputBind["aria-invalid"]).toBe(true);
});
