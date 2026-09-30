// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import type { RichTextJSON, RichTextValue } from "@bridge-ui/core/Domain";
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { RichTextEditor } from "@/Components/RichTextEditor";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  resetLayerStackForTests();
});

function paragraphDoc(text: string): RichTextJSON {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ text, type: "text" }] }],
  };
}

function EchoingEditor(props: { onChange: (value: RichTextValue) => void }) {
  const [value, setValue] = useState<RichTextValue>("<p>Hi</p>");

  return (
    <RichTextEditor
      value={value}
      aria-label="Description"
      onChange={(next) => {
        props.onChange(next);
        setValue(next);
      }}
    />
  );
}

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

  fireEvent.click(screen.getByRole("button", { name: "Heading 1" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should sync the editor when the controlled value changes", () => {
  const onChange = vi.fn();

  const view = render(
    <RichTextEditor
      value="<p>Hi</p>"
      onChange={onChange}
      aria-label="Description"
    />,
  );

  const textbox = screen.getByRole("textbox");

  expect(textbox.querySelector("p")?.textContent).toBe("Hi");

  view.rerender(
    <RichTextEditor
      onChange={onChange}
      value="<h2>Bye</h2>"
      aria-label="Description"
    />,
  );

  expect(screen.getByRole("textbox")).toBe(textbox);
  expect(textbox.querySelector("h2")?.textContent).toBe("Bye");
  expect(textbox.textContent).not.toContain("Hi");

  view.rerender(
    <RichTextEditor value="" onChange={onChange} aria-label="Description" />,
  );

  expect(textbox.textContent).toBe("");
  expect(onChange).not.toHaveBeenCalled();
});

test("it should sync a json document when the controlled value changes", () => {
  const onChange = vi.fn();

  const view = render(
    <RichTextEditor
      format="json"
      onChange={onChange}
      aria-label="Description"
      value={paragraphDoc("Hi")}
    />,
  );

  const textbox = screen.getByRole("textbox");

  expect(textbox.textContent).toBe("Hi");

  view.rerender(
    <RichTextEditor
      format="json"
      onChange={onChange}
      aria-label="Description"
      value={paragraphDoc("Bye")}
    />,
  );

  expect(textbox.textContent).toBe("Bye");
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox")).toBe(textbox);
});

test("it should keep the edit when the parent echoes onChange back as value", () => {
  const onChange = vi.fn();

  render(<EchoingEditor onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Heading 1" }));

  const textbox = screen.getByRole("textbox");

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(textbox.querySelector("h1")?.textContent).toBe("Hi");
  expect(onChange.mock.calls[0]?.[0]).toContain("<h1>Hi</h1>");
  expect(
    screen
      .getByRole("button", { name: "Heading 1" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
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

test("it should forward its color to the link editor", () => {
  render(<RichTextEditor color="success" aria-label="Description" />);

  fireEvent.click(screen.getByRole("button", { name: "Link" }));

  const urlField = screen
    .getByRole("textbox", { name: "URL" })
    .closest('[class*="ring-success-600"]');

  const surface = document.querySelector("[contenteditable]");

  expect(surface).toBeTruthy();
  expect(urlField).toBeTruthy();
  expect(urlField?.contains(surface)).toBe(false);
  expect(screen.getByRole("button", { name: "Apply" }).className).toContain(
    "bg-success-500",
  );
  expect(screen.getByRole("button", { name: "Cancel" }).className).toContain(
    "text-success-600",
  );
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
