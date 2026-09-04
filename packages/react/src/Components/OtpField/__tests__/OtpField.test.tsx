// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { OtpField } from "@/Components/OtpField";
import { BridgeUIProvider } from "@/Provider";

test("it should render the default number of pin inputs", () => {
  render(<OtpField aria-label="Code" />);

  expect(screen.getAllByRole("textbox")).toHaveLength(6);
});

test("it should render a custom length", () => {
  render(<OtpField length={4} aria-label="Code" />);

  expect(screen.getAllByRole("textbox")).toHaveLength(4);
});

test("it should render a label when label prop is provided", () => {
  render(<OtpField label="Verification code" />);

  expect(screen.getByText("Verification code")).toBeTruthy();
});

test("it should update value when typing a digit", () => {
  const onChange = vi.fn();

  render(<OtpField length={4} aria-label="Code" onChange={onChange} />);

  fireEvent.input(screen.getAllByRole("textbox")[0]!, {
    target: { value: "1" },
  });

  expect(onChange).toHaveBeenCalledWith("1");
});

test("it should call onComplete when all pins are filled", () => {
  const onComplete = vi.fn();

  render(
    <OtpField
      length={4}
      value="123"
      aria-label="Code"
      onComplete={onComplete}
      onChange={() => undefined}
    />,
  );

  fireEvent.input(screen.getAllByRole("textbox")[3]!, {
    target: { value: "4" },
  });

  expect(onComplete).toHaveBeenCalledWith("1234");
});

test("it should paste digits across pins", () => {
  const onChange = vi.fn();

  render(<OtpField length={4} aria-label="Code" onChange={onChange} />);

  const first = screen.getAllByRole("textbox")[0]!;

  fireEvent.paste(first, {
    clipboardData: { getData: () => "9876" },
  });

  expect(onChange).toHaveBeenCalledWith("9876");
});

test("it should disable all pins when disabled", () => {
  render(<OtpField disabled aria-label="Code" />);

  for (const input of screen.getAllByRole("textbox")) {
    expect(input).toHaveProperty("disabled", true);
  }
});

test("it should show an error message when invalid", () => {
  render(
    <OtpField
      error
      label="Code"
      aria-label="Code"
      errorMessage="Invalid code"
    />,
  );

  expect(screen.getByText("Invalid code")).toBeTruthy();
});

test("it should render start slot content", () => {
  render(
    <OtpField
      aria-label="Code"
      slots={{ start: <span data-testid="start-slot">🔒</span> }}
    />,
  );

  expect(screen.getByTestId("start-slot")).toBeTruthy();
});

test("it should render end slot content", () => {
  render(
    <OtpField
      aria-label="Code"
      slots={{ end: <span data-testid="end-slot">Resend</span> }}
    />,
  );

  expect(screen.getByTestId("end-slot")).toBeTruthy();
});

test("it should apply color from BridgeUIProvider defaultProps", () => {
  const { container } = render(
    <BridgeUIProvider
      components={{
        OtpField: { defaultProps: { color: "success" } },
      }}
    >
      <OtpField aria-label="Code" />
    </BridgeUIProvider>,
  );

  expect(
    container.querySelector(".focus-within\\:ring-success-600"),
  ).not.toBeNull();
});
