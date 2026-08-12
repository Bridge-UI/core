// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

test("it should render accordion item in the browser", () => {
  cy.mount(
    <Accordion defaultValue="a">
      <AccordionItem value="a" title="Shipping">
        Delivery
      </AccordionItem>
    </Accordion>,
  );

  cy.contains("button", "Shipping").should(
    "have.attr",
    "aria-expanded",
    "true",
  );
  cy.contains("Delivery").should("be.visible");
});
