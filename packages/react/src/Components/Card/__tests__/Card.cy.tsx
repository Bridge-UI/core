// ** Local Imports
import { Card } from "@/Components/Card";

test("it should render with default props", () => {
  cy.mount(<Card />);

  cy.get("div").should("exist");
});

test("it should render a title when title prop is provided", () => {
  cy.mount(<Card title="Card title" />);

  cy.contains("Card title").should("be.visible");
});

test("it should render body content via children", () => {
  cy.mount(<Card title="Info">This is the body content</Card>);

  cy.contains("This is the body content").should("be.visible");
});

test("it should apply rounded classes when rounded prop is set", () => {
  cy.mount(<Card rounded="lg" title="Rounded" />);

  cy.contains("Rounded")
    .closest(".flex.w-full")
    .should("have.class", "rounded-lg");
});

test("it should apply shadow classes for elevated variant", () => {
  cy.mount(<Card shadow="md" title="Shadow" variant="elevated" />);

  cy.contains("Shadow")
    .closest(".flex.w-full")
    .should("have.class", "shadow-md");
});

test("it should not apply shadow for flat variant", () => {
  cy.mount(<Card shadow="md" title="Flat" variant="flat" />);

  cy.contains("Flat")
    .closest(".flex.w-full")
    .should("not.have.class", "shadow-md");
});

test("it should apply outlined border on root", () => {
  cy.mount(<Card title="Outlined" variant="outlined" />);

  cy.contains("Outlined")
    .closest(".flex.w-full")
    .should("have.class", "border");
});

test("it should render footer slot content", () => {
  cy.mount(
    <Card
      title="With footer"
      slots={{ footer: <span>Footer content</span> }}
    />,
  );

  cy.contains("Footer content").should("be.visible");
});

test("it should render action slot content", () => {
  cy.mount(
    <Card
      title="With action"
      slots={{ action: <button type="button">Action</button> }}
    />,
  );

  cy.contains("Action").should("be.visible");
});
