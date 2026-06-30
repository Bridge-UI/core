// ** Local Imports
import { Snackbar } from "@/Components/Snackbar";

test("it should not render snackbar when show is false", () => {
  cy.mount(<Snackbar show={false} title="Hidden" />);

  cy.get('[data-snackbar-part="panel"]').should("not.exist");
});

test("it should render snackbar when show is true", () => {
  cy.mount(
    <Snackbar show title="Saved" duration={false} transition="none">
      Body
    </Snackbar>,
  );

  cy.get('[role="status"]').should("be.visible");
  cy.contains("Saved").should("be.visible");
  cy.contains("Body").should("be.visible");
});

test("it should call onShowChange when the close button is clicked", () => {
  cy.mount(
    <Snackbar
      show
      title="Close me"
      duration={false}
      transition="none"
      onShowChange={cy.stub().as("onShowChange")}
    />,
  );

  cy.get('button[aria-label="Close"]').click();

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should call onClose when the close button is clicked", () => {
  cy.mount(
    <Snackbar
      show
      title="Close me"
      duration={false}
      transition="none"
      onClose={cy.stub().as("onClose")}
    />,
  );

  cy.get('button[aria-label="Close"]').click();

  cy.get("@onClose").should("have.been.calledOnce");
});

test("it should call onShowChange on escape", () => {
  cy.mount(
    <Snackbar
      show
      title="Dismiss"
      duration={false}
      transition="none"
      onShowChange={cy.stub().as("onShowChange")}
    />,
  );

  cy.get('[role="status"]').should("be.visible");

  cy.window().then((win) => {
    win.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should apply slide transition classes by default", () => {
  cy.mount(<Snackbar show title="Animated" duration={false} />);

  cy.get('[data-snackbar-part="panel"]').should(
    "have.class",
    "data-[state=open]:translate-y-0",
  );
});

test("it should apply position classes on the portal layer", () => {
  cy.mount(
    <Snackbar
      show
      title="Top"
      duration={false}
      transition="none"
      position="top-center"
    />,
  );

  cy.get("[data-snackbar-layer]").should("have.class", "items-start");
});

test("it should apply rounded classes when rounded prop is set", () => {
  cy.mount(
    <Snackbar
      show
      rounded="xl"
      title="Rounded"
      duration={false}
      transition="none"
    />,
  );

  cy.get('[data-snackbar-part="panel"]').should("have.class", "rounded-xl");
});

test("it should render title and description", () => {
  cy.mount(
    <Snackbar
      show
      title="Hello"
      duration={false}
      transition="none"
      description="World"
    />,
  );

  cy.contains("Hello").should("be.visible");
  cy.contains("World").should("be.visible");
});
