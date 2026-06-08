// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import {
  isModalBackdropClick,
  resolveModalPortalElement,
} from "@core/Utils/portal";

afterEach(() => {
  document.body.innerHTML = "";
});

test("it should return body by default", () => {
  expect(resolveModalPortalElement(undefined)).toBe(document.body);
});

test("it should return null when teleport is disabled", () => {
  expect(resolveModalPortalElement(false)).toBeNull();
});

test("it should match click.self semantics", () => {
  const backdrop = document.createElement("div");
  const panel = document.createElement("div");

  backdrop.append(panel);

  const selfClick = {
    target: backdrop,
    currentTarget: backdrop,
  } as MouseEvent;

  const bubbledClick = {
    target: panel,
    currentTarget: backdrop,
  } as MouseEvent;

  expect(isModalBackdropClick(selfClick)).toBe(true);
  expect(isModalBackdropClick(bubbledClick)).toBe(false);
});
