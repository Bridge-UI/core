// ** Local Imports
import { Spinner } from "@/Components/Spinner";

test("it should render with role progressbar", () => {
  cy.mount(<Spinner aria-label="Loading…" />);

  cy.get('[role="progressbar"]').should("exist");
});

test("it should apply size-md by default", () => {
  cy.mount(<Spinner aria-label="Loading…" />);

  cy.get('[role="progressbar"]').should("have.class", "size-10");
});

test("it should apply determinate aria value", () => {
  cy.mount(
    <Spinner value={50} variant="determinate" aria-label="Export data" />,
  );

  cy.get('[role="progressbar"]').should("have.attr", "aria-valuenow", "50");
});

test("it should apply indeterminate rotate animation", () => {
  cy.mount(<Spinner aria-label="Loading…" />);

  cy.get('[role="progressbar"]').should(
    "have.class",
    "animate-bridge-spinner-rotate",
  );
});

test("it should render track when enableTrack is true", () => {
  cy.mount(<Spinner enableTrack aria-label="Loading…" />);

  cy.get('[role="progressbar"] circle').should("have.length", 2);
});
