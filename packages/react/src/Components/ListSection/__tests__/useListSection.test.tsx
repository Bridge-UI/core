// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { ListContext } from "@/Components/List/ListContext";
import {
  useListSection,
  type ListSectionProps,
} from "@/Components/ListSection";

function renderUseListSection(
  props: ListSectionProps = {},
  context: { dense: boolean } | null = null,
) {
  return renderHook(() => useListSection(props), {
    wrapper: ({ children }) => (
      <ListContext.Provider value={context}>{children}</ListContext.Provider>
    ),
  });
}

test("it should apply section title classes", () => {
  const { result } = renderUseListSection({ title: "Settings" });

  expect(result.current.titleBind.className).toContain("uppercase");
  expect(result.current.titleBind.className).toContain("text-xs");
  expect(result.current.titleBind.role).toBe("presentation");
});

test("it should apply sticky classes when sticky is true", () => {
  const { result } = renderUseListSection({ sticky: true, title: "Sticky" });

  expect(result.current.titleBind.className).toContain("sticky");
});

test("it should apply inset padding when inset is true", () => {
  const { result } = renderUseListSection({ inset: true, title: "Inset" });

  expect(result.current.titleBind.className).toContain("pl-14");
});

test("it should inherit dense padding from parent List context", () => {
  const { result } = renderUseListSection(
    { title: "Dense section" },
    { dense: true },
  );

  expect(result.current.titleBind.className).toContain("py-1.5");
  expect(result.current.titleBind.className).not.toContain("py-2");
});

test("it should apply list-none on root bind", () => {
  const { result } = renderUseListSection({ title: "Section" });

  expect(result.current.rootBind.className).toContain("list-none");
});

test("it should prefer title prop over children for label", () => {
  const { result } = renderUseListSection({
    title: "From title",
    children: "From children",
  });

  expect(result.current.label).toBe("From title");
});
