// ** External Imports
import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";

// ** Local Imports
import { Label } from "@/Components/Label";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

test("it should render children inside a label element", () => {
  const { container } = render(Label, {
    props: { for: "email", children: textSnippet("Email") },
  });

  const label = container.querySelector("label");

  expect(label?.textContent).toContain("Email");
  expect(label?.getAttribute("for")).toBe("email");
});

test("it should show the required asterisk", () => {
  const { container } = render(Label, {
    props: { required: true, children: textSnippet("Name") },
  });

  expect(container.textContent).toContain("*");
});

test("it should apply error colors", () => {
  const { container } = render(Label, {
    props: { error: true, children: textSnippet("Name") },
  });

  expect(container.querySelector("label")?.classList).toContain(
    "text-error-600",
  );
});
