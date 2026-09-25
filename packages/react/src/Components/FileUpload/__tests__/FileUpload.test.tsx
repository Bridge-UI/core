// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";
import { FileUploadItem } from "@/Components/FileUploadItem";
import { BridgeUIProvider } from "@/Provider";

function makeFile(
  name: string,
  options: { size?: number; type?: string } = {},
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

test("it should render a corner label beside the field label", () => {
  render(<FileUpload corner="Optional" label="Attachments" />);

  expect(screen.getByText("Optional")).toBeTruthy();
  expect(screen.getByText("Attachments")).toBeTruthy();
});

test("it should render the corner slot", () => {
  render(
    <FileUpload label="Attachments" slots={{ corner: <span>Later</span> }} />,
  );

  expect(screen.getByText("Later")).toBeTruthy();
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
  expect(onChange.mock.calls[0][0]).toBe(file);
});

test("it should render a single file as an attachment card without the trigger", () => {
  const file = makeFile("note.txt", { size: 12 });

  render(<FileUpload value={file} />);

  expect(screen.getByText("note.txt")).toBeTruthy();
  expect(screen.getByText("TXT · 12 B")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Choose file" })).toBeNull();
});

test("it should render the controlled file list and remove files", () => {
  const file = makeFile("note.txt", { size: 12 });
  const onChange = vi.fn();
  const onRemove = vi.fn();

  render(<FileUpload value={file} onChange={onChange} onRemove={onRemove} />);

  expect(screen.getByText("note.txt")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Remove note.txt" }));

  expect(onRemove).toHaveBeenCalledWith(file, 0);
  expect(onChange).toHaveBeenCalledWith(null);
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

  expect(onChange).toHaveBeenCalledWith(null);
  expect(screen.getByText("1 file could not be added.")).toBeTruthy();
});

test("it should use a custom button label", () => {
  render(<FileUpload buttonLabel="Browse" />);

  expect(screen.getByRole("button", { name: "Browse" })).toBeTruthy();
});

test("it should render a remote attachment card", () => {
  render(<FileUpload value={{ size: 946 * 1024, name: "Diploma.pdf" }} />);

  expect(screen.getByText("Diploma.pdf")).toBeTruthy();
  expect(screen.getByText("PDF · 946 KB")).toBeTruthy();
});

test("it should preview a remote image from its url", () => {
  const { container } = render(
    <FileUpload
      value={{
        size: 10,
        name: "photo.png",
        type: "image/png",
        url: "https://cdn.example/photo.png",
      }}
    />,
  );

  expect(container.querySelector("img")?.getAttribute("src")).toBe(
    "https://cdn.example/photo.png",
  );
});

test("it should keep a remote item when a new file is added", () => {
  const remote = { size: 100, name: "Diploma.pdf" };
  const onChange = vi.fn();
  const { container } = render(
    <FileUpload
      multiple
      accept="image/*"
      value={[remote]}
      onChange={onChange}
    />,
  );
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;

  fireEvent.change(input, {
    target: { files: [makeFile("a.png", { type: "image/png" })] },
  });

  expect(onChange.mock.calls[0][0][0]).toEqual(remote);
  expect(onChange.mock.calls[0][0][1].name).toBe("a.png");
});

test("it should replace the default list when the list slot is set", () => {
  const file = makeFile("note.txt", { size: 12 });

  render(
    <FileUpload
      value={file}
      slots={{
        list: ({ items }) => (
          <div>
            {items.map((item) => (
              <span key={item.index}>{item.value.name}</span>
            ))}
          </div>
        ),
      }}
    />,
  );

  expect(screen.queryByRole("list")).toBeNull();
  expect(screen.getByText("note.txt")).toBeTruthy();
});

test("it should render a start slot and replace the remove button with end", () => {
  const file = makeFile("note.txt", { size: 12 });

  render(
    <FileUpload
      value={file}
      slots={{
        start: <span>Drag</span>,
        end: <button type="button">Clear</button>,
      }}
    />,
  );

  expect(screen.getByText("Drag")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Remove note.txt" })).toBeNull();
});

test("it should reuse FileUploadItem inside the list slot", () => {
  const file = makeFile("note.txt", { size: 12 });

  render(
    <FileUpload
      value={file}
      slots={{
        list: ({ items }) => (
          <div>
            {items.map((item) => (
              <FileUploadItem
                {...item}
                key={item.index}
                slots={{ start: <span>Handle</span> }}
              />
            ))}
          </div>
        ),
      }}
    />,
  );

  expect(screen.getByText("Handle")).toBeTruthy();
  expect(screen.getByText("note.txt")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Remove note.txt" })).toBeTruthy();
});

test("it should color the dropzone from the color prop while dragging", () => {
  render(<FileUpload title="Drop" color="success" variant="dropzone" />);

  const zone = screen.getByRole("button");

  expect(zone.className).not.toContain("border-success-500");

  fireEvent.dragEnter(zone);

  expect(zone.className).toContain("bg-success-50");
  expect(zone.className).toContain("border-success-500");
  expect(zone.className).not.toContain("border-primary-500");
});

test("it should render upload states on the file card", () => {
  render(
    <FileUpload
      onRetry={() => undefined}
      value={{
        progress: 64,
        state: "uploading",
        name: "financial-model.xlsx",
      }}
    />,
  );

  expect(screen.getByText("Uploading · 64%")).toBeTruthy();
  expect(screen.getByText("financial-model.xlsx").className).toContain(
    "animate-pulse",
  );
});

test("it should retry a failed upload", () => {
  const onRetry = vi.fn();
  const value = {
    state: "error" as const,
    name: "financial-model.xlsx",
  };

  render(<FileUpload value={value} onRetry={onRetry} />);

  expect(screen.getByText("Upload failed. Try again.")).toBeTruthy();

  fireEvent.click(
    screen.getByRole("button", { name: "Retry financial-model.xlsx" }),
  );

  expect(onRetry).toHaveBeenCalledWith(value, 0);
});

test("it should hide the meta line at size xs", () => {
  render(
    <FileUpload
      size="xs"
      value={makeFile("notes.pdf", { size: 1200, type: "application/pdf" })}
    />,
  );

  expect(screen.getByText("notes.pdf")).toBeTruthy();
  expect(screen.queryByText(/PDF/)).toBeNull();
});

test("it should lay vertical cards in a row", () => {
  const { container } = render(
    <FileUpload
      orientation="vertical"
      value={makeFile("notes.pdf", { size: 12, type: "application/pdf" })}
    />,
  );

  expect(container.querySelector("ul")?.className).toContain("flex-row");
  expect(container.querySelector("li")?.className).toContain("flex-col");
});

test("it should hide the state line when description is cleared", () => {
  const { rerender } = render(
    <FileUpload
      size="xs"
      value={{ description: "", name: "report.pdf", state: "uploading" }}
    />,
  );

  expect(screen.queryByText(/Uploading/)).toBeNull();

  rerender(
    <FileUpload
      size="md"
      value={{ state: "error", description: null, name: "report.pdf" }}
    />,
  );

  expect(screen.queryByText("Upload failed. Try again.")).toBeNull();
});

test("it should replace the meta line with a custom description", () => {
  render(
    <FileUpload
      value={{
        name: "research-summary.pdf",
        description: "Open preview dialog",
      }}
    />,
  );

  expect(screen.getByText("Open preview dialog")).toBeTruthy();
});

test("it should color the dropzone from the registry color while dragging", () => {
  render(
    <BridgeUIProvider
      components={{
        FileUpload: { defaultProps: { color: "warning" } },
      }}
    >
      <FileUpload title="Drop" variant="dropzone" />
    </BridgeUIProvider>,
  );

  const zone = screen.getByRole("button");

  fireEvent.dragEnter(zone);

  expect(zone.className).toContain("border-warning-500");
  expect(zone.className).not.toContain("border-primary-500");
});
