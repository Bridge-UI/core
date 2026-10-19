// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import { useBaseField, type BaseFieldProps } from "@/Components/BaseField";
import { renderHook } from "@/Utils/__tests__/renderHook";

function renderUseBaseField(props: BaseFieldProps = {}) {
  return renderHook(
    (hookProps: () => BaseFieldProps) =>
      useBaseField(
        hookProps,
        { size: "md", error: false, hideErrorMessage: false },
        { autoId: "auto-id" },
      ),
    { props },
  );
}

test("it should fall back to the auto id", () => {
  expect(renderUseBaseField().result.controlId).toBe("auto-id");
});

test("it should prefer controlId over the auto id", () => {
  expect(renderUseBaseField({ controlId: "otp" }).result.controlId).toBe("otp");
});

test("it should reserve the error row unless hideErrorMessage", () => {
  expect(renderUseBaseField().result.showErrorMessageRow).toBe(true);
  expect(
    renderUseBaseField({ hideErrorMessage: true }).result.showErrorMessageRow,
  ).toBe(false);
});

test("it should react to error changes", async () => {
  const { result, rerender } = renderUseBaseField({ errorMessage: "Bad" });

  expect(result.showErrorMessageContent).toBe(false);

  await rerender({ error: true });

  expect(result.invalidated).toBe(true);
  expect(result.showErrorMessageContent).toBe(true);
});
