// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

test("it should render accordion in the browser", () => {
  cy.mount(
    <Accordion defaultValue="a">
      <AccordionItem value="a" title="Shipping">
        Delivery in 2–5 business days.
      </AccordionItem>
      <AccordionItem value="b" title="Returns">
        Free returns within 30 days.
      </AccordionItem>
    </Accordion>,
  );

  cy.get('[aria-expanded="true"]').should("exist");
  cy.contains("Delivery in 2–5 business days.").should("be.visible");
});
