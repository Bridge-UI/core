// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Card } from "@/Components/Card";
import { Modal } from "@/Components/Modal";

test("it should not render dialog when modelValue is false", () => {
  cy.mount(Modal, { props: { modelValue: false } });

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should render dialog when modelValue is true", () => {
  cy.mount(Modal, {
    props: { modelValue: true },
    slots: { default: () => "Modal body" },
  });

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Modal body").should("be.visible");
});

test("it should emit close when the backdrop is clicked", () => {
  cy.mount(Modal, {
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
  cy.mount(Modal, {
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
  cy.mount(Modal, {
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

test("it should apply fade transition classes by default", () => {
  cy.mount(Modal, {
    props: { modelValue: true },
    slots: { default: () => "Animated" },
  });

  cy.get('[data-modal-part="overlay"]').should(
    "have.class",
    "data-[state=open]:opacity-100",
  );
});

test("it should not emit update:modelValue when persistent", () => {
  cy.mount(Modal, {
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

test("it should apply size classes on the wrapper", () => {
  cy.mount(Modal, {
    slots: { default: () => "Sized" },
    props: { size: "lg", modelValue: true },
  });

  cy.get('[role="dialog"]').should("have.class", "sm:max-w-lg");
});

test("it should render a Card inside the default slot", () => {
  cy.mount(Modal, {
    props: { modelValue: true },
    slots: {
      default: () => h(Card, { title: "In modal" }, () => "Body"),
    },
  });

  cy.contains("Body").should("be.visible");
  cy.contains("In modal").should("be.visible");
});
