// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { useOtpField } from "@/Components/OtpField";

test("it should merge default size color and variant", () => {
  const { result } = renderHook(() => useOtpField({}));

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.variant).toBe("outline");
  expect(result.current.length).toBe(6);
});

test("it should expose digit slots from value", () => {
  const { result } = renderHook(() => useOtpField({ length: 4, value: "12" }));

  expect(result.current.digits).toEqual(["1", "2", "", ""]);
});

test("it should commit typed digits through onChange", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useOtpField({ onChange, length: 4 }));

  act(() => {
    result.current.handlePinInput(0, {
      target: { value: "9" },
    } as unknown as React.FormEvent<HTMLInputElement>);
  });

  expect(onChange).toHaveBeenCalledWith("9");
});

test("it should mark the field as invalidated when error is set", () => {
  const { result } = renderHook(() => useOtpField({ error: true }));

  expect(result.current.invalidated).toBe(true);
});

test("it should resolve numeric input mode by default", () => {
  const { result } = renderHook(() => useOtpField({}));

  expect(result.current.inputType).toBe("numeric");
  expect(result.current.inputBind(0).inputMode).toBe("numeric");
});

test("it should expose start and end slot binds", () => {
  const { result } = renderHook(() =>
    useOtpField({
      slots: {
        end: "end",
        start: "start",
      },
    }),
  );

  expect(result.current.startSlotBind.className).toContain(
    "wrapper-start-slot",
  );
  expect(result.current.endSlotBind.className).toContain("wrapper-end-slot");
});
