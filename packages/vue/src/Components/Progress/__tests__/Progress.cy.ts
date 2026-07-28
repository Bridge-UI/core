// ** Local Imports
import { Progress } from "@/Components/Progress";

test("it should render with role progressbar", () => {
  cy.mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"]').should("exist");
});

test("it should apply rounded-full by default", () => {
  cy.mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"]').should("have.class", "rounded-full");
});

test("it should apply determinate width", () => {
  cy.mount(Progress, {
    attrs: { "aria-label": "Export data" },
    props: { value: 50, variant: "determinate" },
  });

  cy.get('[role="progressbar"]').should("have.attr", "aria-valuenow", "50");
  cy.get('[role="progressbar"] > div').last().should("have.css", "width");
});

test("it should apply indeterminate animation class", () => {
  cy.mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"] > div')
    .last()
    .should("have.class", "animate-bridge-progress-indeterminate");
});

test("it should render buffer bars", () => {
  cy.mount(Progress, {
    attrs: { "aria-label": "Loading…" },
    props: { value: 25, valueBuffer: 50, variant: "buffer" },
  });

  cy.get('[role="progressbar"] > div').should("have.length", 3);
});
