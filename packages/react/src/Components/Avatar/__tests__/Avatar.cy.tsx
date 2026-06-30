// ** Local Imports
import { Avatar } from "@/Components/Avatar";

test("it should render an image when src is passed", () => {
  cy.mount(<Avatar alt="Jane Doe" src="https://example.com/avatar.jpg" />);

  cy.get("img")
    .should("exist")
    .and("have.attr", "src", "https://example.com/avatar.jpg")
    .and("have.attr", "alt", "Jane Doe");
});

test("it should render fallback text", () => {
  cy.mount(<Avatar fallback="JP" />);

  cy.contains("JP").should("be.visible");
});

test("it should render default icon when no src or fallback is passed", () => {
  cy.mount(<Avatar />);

  cy.get("svg").should("exist");
});

test("it should apply rounded-full by default", () => {
  cy.mount(<Avatar fallback="JP" />);

  cy.get("div").should("have.class", "rounded-full");
});

test("it should merge custom className", () => {
  cy.mount(<Avatar fallback="JP" className="custom-avatar" />);

  cy.get("div").should("have.class", "custom-avatar");
});
