// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

afterEach(() => {
  cleanup();
});

test("it should render title and panel content", () => {
  render(
    <Accordion defaultValue="a">
      <AccordionItem value="a" title="Shipping">
        Delivery details
      </AccordionItem>
    </Accordion>,
  );

  expect(screen.getByRole("button", { name: /Shipping/i })).toBeTruthy();
  expect(screen.getByText("Delivery details")).toBeTruthy();
});

test("it should wire aria-controls between trigger and panel", () => {
  render(
    <Accordion defaultValue="a">
      <AccordionItem value="a" title="Shipping">
        Delivery details
      </AccordionItem>
    </Accordion>,
  );

  const trigger = screen.getByRole("button", { name: /Shipping/i });
  const panelId = trigger.getAttribute("aria-controls");

  expect(panelId).toBeTruthy();
  expect(document.getElementById(panelId!)).toBeTruthy();
});
