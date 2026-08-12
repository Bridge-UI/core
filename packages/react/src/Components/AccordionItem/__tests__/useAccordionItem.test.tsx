// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { useAccordionItem } from "@/Components/AccordionItem/hooks/useAccordionItem";

afterEach(() => {
  cleanup();
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <Accordion defaultValue="a" multiple={false}>
      {children}
    </Accordion>
  );
}

test("it should mark the matching item as expanded", () => {
  const { result } = renderHook(
    () => useAccordionItem({ value: "a", title: "Shipping" }),
    { wrapper },
  );

  expect(result.current.expanded).toBe(true);
  expect(result.current.triggerBind["aria-expanded"]).toBe(true);
});

test("it should mark a different item as collapsed", () => {
  const { result } = renderHook(
    () => useAccordionItem({ value: "b", title: "Returns" }),
    { wrapper },
  );

  expect(result.current.expanded).toBe(false);
});
