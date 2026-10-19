// ** External Imports
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";

// ** Local Imports
import BaseFieldHost from "@/Components/BaseField/__tests__/BaseFieldHost.svelte";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

test("it should render label, corner and description text", () => {
  const { container } = render(BaseFieldHost, {
    props: { label: "Code", corner: "6 digits", description: "Check email" },
  });

  expect(container.textContent).toContain("Code");
  expect(container.textContent).toContain("6 digits");
  expect(container.textContent).toContain("Check email");
});

test("it should render label snippets", () => {
  const label = createRawSnippet(() => {
    return { render: () => "<strong>Rich label</strong>" };
  });

  const { container } = render(BaseFieldHost, { props: { label } });

  expect(container.querySelector("label strong")?.textContent).toBe(
    "Rich label",
  );
});

test("it should render children and start / end snippets in the group", () => {
  const { container } = render(BaseFieldHost, {
    props: {
      end: textSnippet("end"),
      start: textSnippet("start"),
      children: textSnippet("control"),
    },
  });

  const group = container.querySelector('[role="group"]');

  expect(group?.textContent).toContain("start");
  expect(group?.textContent).toContain("control");
  expect(group?.textContent).toContain("end");
});

test("it should show the error message and describe the group", () => {
  const { container } = render(BaseFieldHost, {
    props: { error: true, controlId: "pin", errorMessage: "Invalid" },
  });

  expect(container.querySelector("#pin-error")?.textContent).toContain(
    "Invalid",
  );
  expect(
    container.querySelector('[role="group"]')?.getAttribute("aria-describedby"),
  ).toBe("pin-error");
});

test("it should hide the description on error unless showDescriptionOnError", () => {
  const { container } = render(BaseFieldHost, {
    props: { error: true, description: "Help", errorMessage: "Invalid" },
  });

  expect(container.textContent).not.toContain("Help");
});
