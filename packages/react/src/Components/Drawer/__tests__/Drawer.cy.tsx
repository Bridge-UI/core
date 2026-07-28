// ** Local Imports
import { Card } from "@/Components/Card";
import { Drawer } from "@/Components/Drawer";

test("it should not render dialog when show is false", () => {
  cy.mount(<Drawer show={false}>Hidden</Drawer>);

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should render dialog when show is true", () => {
  cy.mount(<Drawer show>Drawer body</Drawer>);

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Drawer body").should("be.visible");
});

test("it should call onClose when the backdrop is clicked", () => {
  cy.mount(
    <Drawer show transition="none" onClose={cy.stub().as("onClose")}>
      Content
    </Drawer>,
  );

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onClose").should("have.been.calledOnce");
});

test("it should call onShowChange when the backdrop is clicked", () => {
  cy.mount(
    <Drawer show transition="none" onShowChange={cy.stub().as("onShowChange")}>
      Content
    </Drawer>,
  );

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should call onShowChange on escape", () => {
  cy.mount(
    <Drawer show transition="none" onShowChange={cy.stub().as("onShowChange")}>
      Content
    </Drawer>,
  );

  cy.get('[role="dialog"]').should("be.visible");

  cy.window().then((win) => {
    win.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should apply slide transition classes by default", () => {
  cy.mount(<Drawer show>Animated</Drawer>);

  cy.get('[data-drawer-part="panel"]').should(
    "have.class",
    "data-[state=open]:translate-x-0",
  );
});

test("it should not call onShowChange when persistent", () => {
  cy.mount(
    <Drawer
      show
      persistent
      transition="none"
      onShowChange={cy.stub().as("onShowChange")}
    >
      Persistent
    </Drawer>,
  );

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onShowChange").should("not.have.been.called");
});

test("it should apply size classes on the panel", () => {
  cy.mount(
    <Drawer show size="lg">
      Sized
    </Drawer>,
  );

  cy.get('[role="dialog"]').should("have.class", "w-96");
});

test("it should dock the panel to the right edge", () => {
  cy.mount(
    <Drawer show placement="right">
      Right docked
    </Drawer>,
  );

  cy.get('[role="dialog"]').parent().should("have.class", "justify-end");
});

test("it should render a Card as children", () => {
  cy.mount(
    <Drawer show>
      <Card title="In drawer">Body</Card>
    </Drawer>,
  );

  cy.contains("Body").should("be.visible");
  cy.contains("In drawer").should("be.visible");
});
