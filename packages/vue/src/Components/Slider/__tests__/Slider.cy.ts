// ** Local Imports
import { Slider } from "@/Components/Slider";

test("it should render a slider", () => {
  cy.mount(Slider, {
    props: { label: "Volume" },
  });

  cy.get('[role="slider"]').should("exist");
});

test("it should apply rounded-full on the track by default", () => {
  cy.mount(Slider, {
    props: { label: "Volume" },
  });

  cy.get('[role="slider"]').parent().should("have.class", "rounded-full");
});

test("it should render two thumbs for range", () => {
  cy.mount(Slider, {
    props: { range: true, label: "Range", defaultValue: [10, 90] },
  });

  cy.get('[role="slider"]').should("have.length", 2);
});

test("it should show label chrome", () => {
  cy.mount(Slider, {
    props: { corner: "%", label: "Opacity" },
  });

  cy.contains("Opacity").should("be.visible");
  cy.contains("%").should("be.visible");
});
