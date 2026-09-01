// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Button } from "@/Components/Button";
import { ButtonGroup } from "@/Components/ButtonGroup";

test("it should render a group with role group", () => {
  render(
    <ButtonGroup aria-label="Export">
      <Button>Copy</Button>
      <Button>Paste</Button>
    </ButtonGroup>,
  );

  expect(screen.getByRole("group", { name: "Export" })).not.toBeNull();
});

test("it should apply horizontal orientation by default", () => {
  const { container } = render(
    <ButtonGroup>
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const root = container.querySelector('[data-slot="button-group"]');

  expect(root?.classList.contains("gap-px")).toBe(true);
  expect(root?.classList.contains("flex-row")).toBe(true);
});

test("it should apply vertical orientation when orientation is vertical", () => {
  const { container } = render(
    <ButtonGroup orientation="vertical">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const root = container.querySelector('[data-slot="button-group"]');

  expect(root?.classList.contains("flex-col")).toBe(true);
});

test("it should apply a hairline divider between children", () => {
  const { container } = render(
    <ButtonGroup>
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(
    container
      .querySelector('[data-slot="button-group"]')
      ?.classList.contains("bg-dark-200"),
  ).toBe(true);
});

test("it should stretch to full width when full is set", () => {
  const { container } = render(
    <ButtonGroup full>
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(
    container
      .querySelector('[data-slot="button-group"]')
      ?.classList.contains("w-full"),
  ).toBe(true);
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <ButtonGroup className="mt-4">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(
    container
      .querySelector('[data-slot="button-group"]')
      ?.classList.contains("mt-4"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <ButtonGroup id="export-group" data-testid="button-group">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const root = container.querySelector("#export-group");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("button-group");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <ButtonGroup className="mt-8" classes={{ root: "mt-2" }}>
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const root = container.querySelector('[data-slot="button-group"]');

  expect(root?.classList.contains("mt-8")).toBe(true);
  expect(root?.classList.contains("mt-2")).toBe(false);
});

test("it should render nested groups as clustered children", () => {
  const { container } = render(
    <ButtonGroup aria-label="Editor">
      <ButtonGroup>
        <Button>Bold</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Undo</Button>
      </ButtonGroup>
    </ButtonGroup>,
  );

  expect(container.querySelectorAll('[data-slot="button-group"]').length).toBe(
    3,
  );
});
