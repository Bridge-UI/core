// ** Local Imports
import { Drawer } from "@/Components/Drawer";

test("it should not render dialog when modelValue is false", () => {
  cy.mount(Drawer, { props: { modelValue: false } });

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should render dialog when modelValue is true", () => {
  cy.mount(Drawer, {
    props: { modelValue: true },
    slots: { default: () => "Drawer body" },
  });

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Drawer body").should("be.visible");
});

test("it should emit close when the backdrop is clicked", () => {
  cy.mount(Drawer, {
    slots: { default: () => "Content" },
    props: {
      modelValue: true,
      transition: "none",
      onClose: cy.stub().as("onClose"),
    },
  });

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onClose").should("have.been.calledOnce");
});

test("it should emit update:modelValue when the backdrop is clicked", () => {
  cy.mount(Drawer, {
    slots: { default: () => "Content" },
    props: {
      modelValue: true,
      transition: "none",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onUpdate").should("have.been.calledWith", false);
});

test("it should emit update:modelValue on escape", () => {
  cy.mount(Drawer, {
    slots: { default: () => "Content" },
    props: {
      modelValue: true,
      transition: "none",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get("body").type("{esc}");

  cy.get("@onUpdate").should("have.been.calledWith", false);
});

test("it should apply slide transition classes by default", () => {
  cy.mount(Drawer, {
    props: { modelValue: true },
    slots: { default: () => "Animated" },
  });

  cy.get('[data-drawer-part="overlay"]').should(
    "have.class",
    "data-[state=open]:opacity-100",
  );
});

test("it should not emit update:modelValue when persistent", () => {
  cy.mount(Drawer, {
    slots: { default: () => "Persistent" },
    props: {
      modelValue: true,
      persistent: true,
      transition: "none",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('[aria-hidden="true"]').click({ force: true });

  cy.get("@onUpdate").should("not.have.been.called");
});

test("it should apply size classes on the panel", () => {
  cy.mount(Drawer, {
    slots: { default: () => "Sized" },
    props: { size: "lg", modelValue: true },
  });

  cy.get('[role="dialog"]').should("have.class", "w-96");
});

test("it should dock the panel to the right edge", () => {
  cy.mount(Drawer, {
    slots: { default: () => "Right" },
    props: { modelValue: true, placement: "right" },
  });

  cy.get(".flex.min-h-full.w-full").should("have.class", "justify-end");
});
