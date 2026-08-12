// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

test("it should render accordion in the browser", () => {
  cy.mount(Accordion, {
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(
          AccordionItem,
          { value: "a", title: "Shipping" },
          {
            default: () => "Delivery in 2–5 business days.",
          },
        ),
        h(
          AccordionItem,
          { value: "b", title: "Returns" },
          {
            default: () => "Free returns within 30 days.",
          },
        ),
      ],
    },
  });

  cy.get('[aria-expanded="true"]').should("exist");
  cy.contains("Delivery in 2–5 business days.").should("be.visible");
});
