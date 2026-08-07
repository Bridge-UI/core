// ** Local Imports
import { DatePicker } from "@/Components/DatePicker";

test("it should render the date picker", () => {
  cy.mount(<DatePicker defaultValue={new Date(2021, 4, 21)} />);

  cy.contains("2021").should("be.visible");
});

test("it should size the root to its content in a wide container", () => {
  cy.mount(
    <div style={{ width: 800 }}>
      <DatePicker defaultValue={new Date(2021, 4, 21)} />
    </div>,
  );

  cy.contains("2021")
    .closest(".w-fit")
    .should(($root) => {
      expect($root[0].getBoundingClientRect().width).to.be.lessThan(400);
    });
});

test("it should show footer when enabled", () => {
  cy.mount(<DatePicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
