// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

test("it should render a carousel in the browser", () => {
  cy.mount(Carousel, {
    attrs: { "aria-label": "Photos" },
    slots: {
      default: () => [
        h(CarouselSlide, {}, () => "Front"),
        h(CarouselSlide, {}, () => "Side"),
      ],
    },
  });

  cy.contains("Front").should("be.visible");
  cy.get("[data-part='indicator']")
    .eq(0)
    .should("have.attr", "aria-current", "true");
  cy.get("[data-part='next']").click();
  cy.get("[data-part='indicator']")
    .eq(1)
    .should("have.attr", "aria-current", "true");
  cy.contains("Side").should("be.visible");
});
