// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

test("it should render slide content in the browser", () => {
  cy.mount(Carousel, {
    attrs: { "aria-label": "Photos" },
    slots: {
      default: () => h(CarouselSlide, {}, () => "Front"),
    },
  });

  cy.contains("Front").should("be.visible");
  cy.get("[data-part='slide']").should(
    "have.attr",
    "aria-roledescription",
    "slide",
  );
});
