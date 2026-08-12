// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

test("it should render accordion item in the browser", () => {
  cy.mount(Accordion, {
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(
          AccordionItem,
          { value: "a", title: "Shipping" },
          {
            default: () => "Delivery",
          },
        ),
      ],
    },
  });

  cy.contains("button", "Shipping").should(
    "have.attr",
    "aria-expanded",
    "true",
  );
  cy.contains("Delivery").should("be.visible");
});
