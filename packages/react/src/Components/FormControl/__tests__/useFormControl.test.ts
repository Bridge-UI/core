// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useFormControl,
  type FormControlOwnProps,
} from "@/Components/FormControl";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} as const satisfies Partial<FormControlOwnProps>;

function renderUseFormControl(props: Omit<FormControlOwnProps, "field"> = {}) {
  return renderHook(() => useFormControl(props, libDefaults));
}

test("it should merge default size and error flags", () => {
  const { result } = renderUseFormControl();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.error).toBe(false);
  expect(result.current.merged.withoutErrorMessage).toBe(false);
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseFormControl({ size: "lg" });

  expect(result.current.merged.size).toBe("lg");
});

test("it should mark field as invalidated when error is true", () => {
  const { result } = renderUseFormControl({ error: true });

  expect(result.current.invalidated).toBe(true);
});

test("it should expose control id from controlId prop", () => {
  const { result } = renderUseFormControl({ controlId: "custom-id" });

  expect(result.current.controlId).toBe("custom-id");
});

test("it should fallback controlId to inherited id when controlId is not provided", () => {
  const { result } = renderUseFormControl({ id: "inherited-id" });

  expect(result.current.controlId).toBe("inherited-id");
});

test("it should forward disabled and readonly on controlBind", () => {
  const { result } = renderUseFormControl({ disabled: true, readonly: true });

  expect(result.current.controlBind.disabled).toBe(true);
  expect(result.current.controlBind.readOnly).toBe(true);
});

test("it should set aria-invalid on controlBind when error is set", () => {
  const { result } = renderUseFormControl({ error: true });

  expect(result.current.controlBind["aria-invalid"]).toBe(true);
});

test("it should set aria-describedby on controlBind when description is provided", () => {
  const { result } = renderUseFormControl({
    description: "Helper",
    controlId: "form-control-id",
  });

  expect(result.current.controlBind["aria-describedby"]).toBe(
    "form-control-id-description",
  );
});

test("it should set htmlFor on main label bind to control id", () => {
  const { result } = renderUseFormControl({
    mainLabel: "Label",
    controlId: "form-control-id",
  });

  expect(result.current.mainLabelBind.htmlFor).toBe(result.current.controlId);
});

test("it should reserve error message space by default", () => {
  const { result } = renderUseFormControl();

  expect(result.current.reservesErrorMessageSpace).toBe(true);
});

test("it should not reserve error message space when withoutErrorMessage is true", () => {
  const { result } = renderUseFormControl({ withoutErrorMessage: true });

  expect(result.current.reservesErrorMessageSpace).toBe(false);
});
