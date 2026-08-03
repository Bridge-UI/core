// ** Local Imports
import { Button } from "@/Components/Button";
import { Tooltip } from "@/Components/Tooltip";

test("it should not show the tooltip by default", () => {
  cy.mount(
    <Tooltip content="Save file" slots={{ trigger: <Button>Save</Button> }} />,
  );

  cy.get('[role="tooltip"]').should("not.exist");
});

test("it should render when show is true", () => {
  cy.mount(
    <Tooltip
      show
      content="Save file"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  cy.get('[role="tooltip"]').should("contain.text", "Save file");
});

test("it should render the arrow by default", () => {
  cy.mount(
    <Tooltip
      show
      content="With arrow"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  cy.get('[role="tooltip"] [aria-hidden="true"]').should(
    "have.class",
    "rotate-45",
  );
});

test("it should apply dark background by default", () => {
  cy.mount(
    <Tooltip show content="Dark" slots={{ trigger: <Button>Save</Button> }} />,
  );

  cy.get('[role="tooltip"]').should("have.class", "bg-dark-900");
});

test("it should render custom children in the panel", () => {
  cy.mount(
    <Tooltip show slots={{ trigger: <Button>Save</Button> }}>
      <strong>Custom</strong>
    </Tooltip>,
  );

  cy.get('[role="tooltip"] strong').should("contain.text", "Custom");
});
