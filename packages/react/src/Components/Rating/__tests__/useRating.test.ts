// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useRating, type RatingOwnProps } from "@/Components/Rating";

const libDefaults = {
  max: 5,
  size: "md",
  icon: "star",
  color: "primary",
} as const satisfies Partial<RatingOwnProps>;

function renderUseRating(props: RatingOwnProps = {}) {
  return renderHook(() => useRating(props, libDefaults));
}

test("it should start empty with five items", () => {
  const { result } = renderUseRating();

  expect(result.current.value).toBeNull();
  expect(result.current.icon).toBe("star");
  expect(result.current.items).toHaveLength(5);
});

test("it should select and clear from item clicks", () => {
  const { result } = renderUseRating();

  act(() => {
    result.current.items[2]?.itemBind.onClick?.();
  });

  expect(result.current.value).toBe(3);

  act(() => {
    result.current.items[2]?.itemBind.onClick?.();
  });

  expect(result.current.value).toBeNull();
});

test("it should report the next value without changing a controlled value", () => {
  const values: Array<null | number> = [];

  const { result } = renderUseRating({
    value: 2,
    onChange: (next) => {
      values.push(next);
    },
  });

  act(() => {
    result.current.items[3]?.itemBind.onClick?.();
  });

  expect(values).toEqual([4]);
  expect(result.current.value).toBe(2);
});

test("it should clamp the controlled value to max", () => {
  const { result } = renderUseRating({ max: 3, value: 9 });

  expect(result.current.value).toBe(3);
  expect(result.current.items).toHaveLength(3);
});

test("it should expose a halfway fill for a fractional value", () => {
  const { result } = renderUseRating({ value: 1.5 });

  expect(result.current.value).toBe(1.5);
  expect(result.current.items[2]?.fill).toBe(0);
  expect(result.current.items[0]?.fill).toBe(1);
  expect(result.current.items[1]?.fill).toBe(0.5);
});
