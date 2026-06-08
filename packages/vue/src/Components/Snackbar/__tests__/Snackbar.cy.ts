// ** Local Imports
import { Snackbar } from "@/Components/Snackbar";

test("it should not render snackbar when modelValue is false", () => {
  cy.mount(Snackbar, { props: { title: "Hidden", modelValue: false } });

  cy.get('[data-snackbar-part="panel"]').should("not.exist");
});

test("it should render snackbar when modelValue is true", () => {
  cy.mount(Snackbar, {
    slots: { default: () => "Body" },
    props: {
      title: "Saved",
      duration: false,
      modelValue: true,
      transition: "none",
    },
  });

  cy.get('[role="status"]').should("be.visible");
  cy.contains("Saved").should("be.visible");
  cy.contains("Body").should("be.visible");
});

test("it should emit update:modelValue when the close button is clicked", () => {
  cy.mount(Snackbar, {
    props: {
      duration: false,
      modelValue: true,
      title: "Close me",
      transition: "none",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('button[aria-label="Close"]').click();

  cy.get("@onUpdate").should("have.been.calledWith", false);
});

test("it should emit close when the close button is clicked", () => {
  cy.mount(Snackbar, {
    props: {
      duration: false,
      modelValue: true,
      title: "Close me",
      transition: "none",
      onClose: cy.stub().as("onClose"),
    },
  });

  cy.get('button[aria-label="Close"]').click();

  cy.get("@onClose").should("have.been.calledOnce");
});

test("it should emit update:modelValue on escape", () => {
  cy.mount(Snackbar, {
    props: {
      duration: false,
      modelValue: true,
      title: "Dismiss",
      transition: "none",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get("body").type("{esc}");

  cy.get("@onUpdate").should("have.been.calledWith", false);
});

test("it should apply slide transition classes by default", () => {
  cy.mount(Snackbar, {
    props: {
      duration: false,
      modelValue: true,
      title: "Animated",
    },
  });

  cy.get('[data-snackbar-part="panel"]').should(
    "have.class",
    "data-[state=open]:translate-y-0",
  );
});

test("it should apply position classes on the portal layer", () => {
  cy.mount(Snackbar, {
    props: {
      title: "Top",
      duration: false,
      modelValue: true,
      transition: "none",
      position: "top-center",
    },
  });

  cy.get("[data-snackbar-layer]").should("have.class", "items-start");
});

test("it should render title and description", () => {
  cy.mount(Snackbar, {
    props: {
      title: "Hello",
      duration: false,
      modelValue: true,
      transition: "none",
      description: "World",
    },
  });

  cy.contains("Hello").should("be.visible");
  cy.contains("World").should("be.visible");
});
