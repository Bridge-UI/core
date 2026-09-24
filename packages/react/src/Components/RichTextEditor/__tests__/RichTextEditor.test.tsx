// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { RichTextEditor } from "@/Components/RichTextEditor";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  resetLayerStackForTests();
});

test("it should render a contenteditable surface", () => {
  render(<RichTextEditor aria-label="Description" />);

  expect(screen.getByRole("textbox")).toBeTruthy();
});

test("it should render a label when label prop is provided", () => {
  render(<RichTextEditor label="Description" aria-label="Description" />);

  expect(screen.getByText("Description")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<RichTextEditor aria-label="Description" description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(
    <RichTextEditor error errorMessage="Required" aria-label="Description" />,
  );

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should set aria-invalid when error is set", () => {
  render(<RichTextEditor error aria-label="Description" />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should update aria-invalid when error changes", () => {
  const view = render(<RichTextEditor aria-label="Description" />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBeNull();

  view.rerender(<RichTextEditor error aria-label="Description" />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should render toolbar buttons for default tools", () => {
  render(<RichTextEditor aria-label="Description" />);

  expect(screen.getByRole("toolbar")).toBeTruthy();
  expect(screen.getByLabelText("Bold")).toBeTruthy();
  expect(screen.getByLabelText("Italic")).toBeTruthy();
});

test("it should hide toolbar when readOnly is true", () => {
  render(<RichTextEditor readOnly aria-label="Description" />);

  expect(screen.queryByRole("toolbar")).toBeNull();
});

test("it should limit toolbar tools when tools prop is set", () => {
  render(
    <RichTextEditor
      aria-label="Description"
      tools={["bold", "italic", "link"]}
    />,
  );

  expect(screen.getByLabelText("Bold")).toBeTruthy();
  expect(screen.getByLabelText("Link")).toBeTruthy();
  expect(screen.queryByLabelText("Heading 1")).toBeNull();
});

test("it should call onChange when content is edited", () => {
  const onChange = vi.fn();

  render(
    <RichTextEditor
      value="<p>Hi</p>"
      onChange={onChange}
      aria-label="Description"
    />,
  );

  const surface = screen.getByRole("textbox");
  surface.innerHTML = "<p>Updated</p>";
  fireEvent.input(surface);

  expect(onChange).toHaveBeenCalled();
});

test("it should set aria-describedby when description is shown", () => {
  render(
    <RichTextEditor
      id="rte-field"
      description="Helper"
      aria-label="Description"
    />,
  );

  expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
    "rte-field-description",
  );
});

test("it should apply a link from the url field", () => {
  const prompt = vi.fn();

  vi.stubGlobal("prompt", prompt);

  render(<RichTextEditor aria-label="Description" />);

  fireEvent.click(screen.getByRole("button", { name: "Link" }));

  expect(prompt).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: "URL" })).toBeTruthy();

  fireEvent.change(screen.getByRole("textbox", { name: "URL" }), {
    target: { value: "https://example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));

  expect(screen.queryByRole("textbox", { name: "URL" })).toBeNull();
  expect(
    screen.getByRole("button", { name: "Link" }).getAttribute("aria-pressed"),
  ).toBe("true");
});

test("it should leave the link unset when the url field is cancelled", () => {
  render(<RichTextEditor aria-label="Description" />);

  fireEvent.click(screen.getByRole("button", { name: "Link" }));
  fireEvent.change(screen.getByRole("textbox", { name: "URL" }), {
    target: { value: "https://example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(screen.queryByRole("textbox", { name: "URL" })).toBeNull();
  expect(
    screen.getByRole("button", { name: "Link" }).getAttribute("aria-pressed"),
  ).toBe("false");
});

test("it should remove an active link from the toolbar", () => {
  render(<RichTextEditor aria-label="Description" />);

  fireEvent.click(screen.getByRole("button", { name: "Link" }));
  fireEvent.change(screen.getByRole("textbox", { name: "URL" }), {
    target: { value: "https://example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  fireEvent.click(screen.getByRole("button", { name: "Link" }));

  expect(screen.queryByRole("textbox", { name: "URL" })).toBeNull();
  expect(
    screen.getByRole("button", { name: "Link" }).getAttribute("aria-pressed"),
  ).toBe("false");
});
