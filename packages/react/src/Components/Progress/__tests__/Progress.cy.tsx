// ** Local Imports
import { Progress } from "@/Components/Progress";

test("it should render with role progressbar", () => {
  cy.mount(<Progress aria-label="Loading…" />);

  cy.get('[role="progressbar"]').should("exist");
});

test("it should apply rounded-full by default", () => {
  cy.mount(<Progress aria-label="Loading…" />);

  cy.get('[role="progressbar"]').should("have.class", "rounded-full");
});

test("it should apply determinate width", () => {
  cy.mount(
    <Progress value={50} variant="determinate" aria-label="Export data" />,
  );

  cy.get('[role="progressbar"]').should("have.attr", "aria-valuenow", "50");
  cy.get('[role="progressbar"] > div').last().should("have.css", "width");
});

test("it should apply indeterminate animation class", () => {
  cy.mount(<Progress aria-label="Loading…" />);

  cy.get('[role="progressbar"] > div')
    .last()
    .should("have.class", "animate-bridge-progress-indeterminate");
});

test("it should render buffer bars", () => {
  cy.mount(
    <Progress
      value={25}
      variant="buffer"
      valueBuffer={50}
      aria-label="Loading…"
    />,
  );

  cy.get('[role="progressbar"] > div').should("have.length", 3);
});
