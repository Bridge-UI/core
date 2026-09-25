// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

test("it should render slide content in the browser", () => {
  cy.mount(
    <Carousel aria-label="Photos">
      <CarouselSlide>Front</CarouselSlide>
    </Carousel>,
  );

  cy.contains("Front").should("be.visible");
  cy.get("[data-part='slide']").should(
    "have.attr",
    "aria-roledescription",
    "slide",
  );
});
