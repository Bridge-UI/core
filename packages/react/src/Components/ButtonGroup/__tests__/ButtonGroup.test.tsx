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

  expect(root?.classList.contains("flex-row")).toBe(true);
  expect(root?.className).toContain("before:w-px");
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

test("it should draw a hairline between children by default", () => {
  const { container } = render(
    <ButtonGroup>
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const className =
    container.querySelector('[data-slot="button-group"]')?.className ?? "";

  expect(className).toContain("before:w-px");
  expect(className).not.toContain("-ms-px");
  expect(className).not.toContain("gap-px");
  expect(className).toContain("before:bg-dark-200");
});

test("it should overlap adjacent children when separator is false", () => {
  const { container } = render(
    <ButtonGroup separator={false}>
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const className =
    container.querySelector('[data-slot="button-group"]')?.className ?? "";

  expect(className).toContain("-ms-px");
  expect(className).not.toContain("before:w-px");
});

test("it should color the hairline when color is set", () => {
  const { container } = render(
    <ButtonGroup color="primary">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  const className =
    container.querySelector('[data-slot="button-group"]')?.className ?? "";

  expect(className).toContain("before:bg-primary-200");
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

test("it should apply group variant to nested buttons", () => {
  render(
    <ButtonGroup variant="outline">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(screen.getByRole("button").className).toContain("border-primary-600");
});

test("it should apply group size to nested buttons", () => {
  render(
    <ButtonGroup size="sm" variant="outline">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(screen.getByRole("button").className).toContain("px-3");
});

test("it should let a nested button override the group size", () => {
  render(
    <ButtonGroup size="sm" variant="outline">
      <Button size="lg">Copy</Button>
    </ButtonGroup>,
  );

  const className = screen.getByRole("button").className;

  expect(className).toContain("py-2.5");
  expect(className).not.toContain("px-3");
});

test("it should keep button color when group color is unset", () => {
  render(
    <ButtonGroup variant="outline">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(screen.getByRole("button").className).toContain("text-primary-600");
});

test("it should apply group color to nested buttons when color is set", () => {
  render(
    <ButtonGroup color="error" variant="outline">
      <Button>Copy</Button>
    </ButtonGroup>,
  );

  expect(screen.getByRole("button").className).toContain("text-error-600");
});

test("it should inherit size through a nested group", () => {
  render(
    <ButtonGroup size="sm">
      <ButtonGroup variant="outline">
        <Button>Bold</Button>
      </ButtonGroup>
    </ButtonGroup>,
  );

  const className = screen.getByRole("button").className;

  expect(className).toContain("px-3");
  expect(className).toContain("border-primary-600");
});
