// ** Local Imports
import { Spinner } from "@/Components/Spinner";

test("it should render with role progressbar", () => {
  cy.mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"]').should("exist");
});

test("it should apply size-md by default", () => {
  cy.mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"]').should("have.class", "size-10");
});

test("it should apply determinate aria value", () => {
  cy.mount(Spinner, {
    attrs: { "aria-label": "Export data" },
    props: { value: 50, variant: "determinate" },
  });

  cy.get('[role="progressbar"]').should("have.attr", "aria-valuenow", "50");
});

test("it should apply indeterminate rotate animation", () => {
  cy.mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"] svg').should(
    "have.class",
    "animate-bridge-spinner-rotate",
  );
});

test("it should render track when enableTrack is true", () => {
  cy.mount(Spinner, {
    props: { enableTrack: true },
    attrs: { "aria-label": "Loading…" },
  });

  cy.get('[role="progressbar"] circle').should("have.length", 2);
});
