// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";

function makeFile(
  name: string,
  options: { size?: number; type?: string; } = {},
) {
  const { size = 4, type = "text/plain" } = options;
  const buffer = new Uint8Array(size);

  return new File([buffer], name, { type });
}

test("it should render the choose file button when empty", () => {
  render(<FileUpload />);

  expect(screen.getByRole("button", { name: "Choose file" })).toBeTruthy();
});

test("it should render choose files when multiple is true", () => {
  render(<FileUpload multiple />);

  expect(screen.getByRole("button", { name: "Choose files" })).toBeTruthy();
});

test("it should render a dropzone when variant is dropzone", () => {
  render(
    <FileUpload
      variant="dropzone"
      title="Drop images here"
      description="or click to browse"
    />,
  );

  expect(screen.getByText("Drop images here")).toBeTruthy();
  expect(screen.getByText("or click to browse")).toBeTruthy();
  expect(screen.getByRole("button")).toBeTruthy();
});

test("it should render an optional label", () => {
  render(<FileUpload label="Attachments" />);

  expect(screen.getByText("Attachments")).toBeTruthy();
});

test("it should call onChange when files are selected", () => {
  const onChange = vi.fn();
  const { container } = render(<FileUpload onChange={onChange} />);
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  const file = makeFile("note.txt");

  fireEvent.change(input, { target: { files: [file] } });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0]).toEqual([file]);
});

test("it should render a single file as an attachment card without the trigger", () => {
  const file = makeFile("note.txt", { size: 12 });

  render(<FileUpload value={[file]} />);

  expect(screen.getByText("note.txt")).toBeTruthy();
  expect(screen.getByText("TXT · 12 B")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Choose file" })).toBeNull();
});

test("it should render the controlled file list and remove files", () => {
  const file = makeFile("note.txt", { size: 12 });
  const onChange = vi.fn();
  const onRemove = vi.fn();

  render(<FileUpload value={[file]} onChange={onChange} onRemove={onRemove} />);

  expect(screen.getByText("note.txt")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Remove note.txt" }));

  expect(onRemove).toHaveBeenCalledWith(file, 0);
  expect(onChange).toHaveBeenCalledWith([]);
});

test("it should keep the trigger when multiple and under maxFiles", () => {
  const file = makeFile("note.txt", { size: 12 });

  render(<FileUpload multiple maxFiles={3} value={[file]} />);

  expect(screen.getByText("note.txt")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Choose files" })).toBeTruthy();
});

test("it should reject files that do not match accept", () => {
  const onChange = vi.fn();
  const { container } = render(
    <FileUpload accept="image/*" onChange={onChange} />,
  );
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;

  fireEvent.change(input, {
    target: { files: [makeFile("note.txt", { type: "text/plain" })] },
  });

  expect(onChange).toHaveBeenCalledWith([]);
  expect(screen.getByText("1 file could not be added.")).toBeTruthy();
});

test("it should use a custom button label", () => {
  render(<FileUpload buttonLabel="Browse" />);

  expect(screen.getByRole("button", { name: "Browse" })).toBeTruthy();
});
