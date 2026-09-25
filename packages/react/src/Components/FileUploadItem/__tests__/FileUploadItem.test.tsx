// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";
import { FileUploadItem } from "@/Components/FileUploadItem";

test("it should render the default card inside FileUpload", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });

  render(<FileUpload value={file} />);

  expect(screen.getByText("note.txt")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Remove note.txt" })).toBeTruthy();
});

test("it should render an upload error with retry", () => {
  const onRetry = vi.fn();
  const value = { name: "report.pdf", state: "error" as const };

  render(<FileUpload value={value} onRetry={onRetry} />);

  fireEvent.click(screen.getByRole("button", { name: "Retry report.pdf" }));

  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("listitem").getAttribute("data-state")).toBe("error");
});

test("it should render FileUploadItem from the list slot", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });

  render(
    <FileUpload
      value={file}
      slots={{
        list: ({ items }) => (
          <div>
            {items.map((item) => (
              <FileUploadItem {...item} key={item.index} data-testid="card" />
            ))}
          </div>
        ),
      }}
    />,
  );

  expect(screen.getByTestId("card").textContent).toContain("note.txt");
});
