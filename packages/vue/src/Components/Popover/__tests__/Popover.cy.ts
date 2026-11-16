// ** External Imports
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Popover } from "@/Components/Popover";
import { TextField } from "@/Components/TextField";

function createHost(arrow = false) {
  return defineComponent({
    setup() {
      const open = ref(false);

      return () =>
        h("div", { style: { padding: "80px" } }, [
          h(
            Popover,
            {
              arrow,
              title: "Edit name",
              modelValue: open.value,
              classes: { arrow: "popover-arrow" },
              "onUpdate:modelValue": (value: boolean) => {
                open.value = value;
              },
            },
            {
              trigger: () => h(Button, null, () => "Open"),
              default: () => h(TextField, { label: "Name" }),
            },
          ),
          h("button", { type: "button" }, "After"),
        ]);
    },
  });
}

test("it should not render the content when modelValue is false", () => {
  cy.mount(Popover, {
    props: { modelValue: false },
    slots: { trigger: () => h(Button, null, () => "Open") },
  });

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should open on click and focus the first field", () => {
  cy.mount(createHost());

  cy.contains("button", "Open").click();

  cy.get('[role="dialog"]').should("be.visible");
  cy.focused().should("match", "input");
});

test("it should keep Home and End inside the text field", () => {
  cy.mount(createHost());

  cy.contains("button", "Open").click();

  cy.focused().type("Bridge{home}X");
  cy.focused().should("have.value", "XBridge");
});

test("it should close on Escape and return focus to the trigger", () => {
  cy.mount(createHost());

  cy.contains("button", "Open").click();
  cy.get('[role="dialog"]').should("be.visible");

  cy.focused().type("{esc}");

  cy.get('[role="dialog"]').should("not.exist");
  cy.focused().should("have.attr", "aria-haspopup", "dialog");
});

test("it should close on click outside", () => {
  cy.mount(createHost());

  cy.contains("button", "Open").click();
  cy.get('[role="dialog"]').should("be.visible");

  cy.contains("button", "After").click();

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should render a positioned arrow", () => {
  cy.mount(createHost(true));

  cy.contains("button", "Open").click();

  cy.get('[role="dialog"] .popover-arrow')
    .should("exist")
    .and("have.attr", "style")
    .and("match", /top|left/);
});
