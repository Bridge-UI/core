// ** Local Imports
import { Card } from "@/Components/Card";
import { Modal } from "@/Components/Modal";

test("it should not render dialog when show is false", () => {
  cy.mount(<Modal show={false}>Hidden</Modal>);

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should render dialog when show is true", () => {
  cy.mount(<Modal show>Modal body</Modal>);

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Modal body").should("be.visible");
});

test("it should call onClose when the backdrop is clicked", () => {
  cy.mount(
    <Modal show transition="none" onClose={cy.stub().as("onClose")}>
      Content
    </Modal>,
  );

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onClose").should("have.been.calledOnce");
});

test("it should call onShowChange when the backdrop is clicked", () => {
  cy.mount(
    <Modal show transition="none" onShowChange={cy.stub().as("onShowChange")}>
      Content
    </Modal>,
  );

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should call onShowChange on escape", () => {
  cy.mount(
    <Modal show transition="none" onShowChange={cy.stub().as("onShowChange")}>
      Content
    </Modal>,
  );

  cy.get("body").type("{esc}");

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should apply fade transition classes by default", () => {
  cy.mount(<Modal show>Animated</Modal>);

  cy.get('[data-modal-part="overlay"]').should(
    "have.class",
    "data-[state=open]:opacity-100",
  );
});

test("it should not call onShowChange when persistent", () => {
  cy.mount(
    <Modal
      show
      persistent
      transition="none"
      onShowChange={cy.stub().as("onShowChange")}
    >
      Persistent
    </Modal>,
  );

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onShowChange").should("not.have.been.called");
});

test("it should apply size classes on the wrapper", () => {
  cy.mount(
    <Modal show size="lg">
      Sized
    </Modal>,
  );

  cy.get('[role="dialog"]').should("have.class", "sm:max-w-lg");
});

test("it should render a Card as children", () => {
  cy.mount(
    <Modal show>
      <Card title="In modal">Body</Card>
    </Modal>,
  );

  cy.contains("Body").should("be.visible");
  cy.contains("In modal").should("be.visible");
});
