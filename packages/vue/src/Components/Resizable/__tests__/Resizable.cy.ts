// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

function host(withHandle: boolean) {
  return defineComponent({
    setup() {
      return () =>
        h("div", { style: { width: "600px", height: "200px" } }, [
          h(Resizable, null, () => [
            h(ResizablePanel, null, () => "One"),
            h(ResizableHandle, { withHandle }),
            h(ResizablePanel, null, () => "Two"),
          ]),
        ]);
    },
  });
}

test("it should resize panels by dragging in the browser", () => {
  cy.mount(host(true));

  cy.contains("One").should("be.visible");
  cy.get("[data-part='handle']").should("have.attr", "aria-valuenow", "50");
  cy.get("[data-part='handle']").then(($handle) => {
    const rect = $handle[0]?.getBoundingClientRect();
    const x = (rect?.left ?? 0) + (rect?.width ?? 0) / 2;
    const y = (rect?.top ?? 0) + (rect?.height ?? 0) / 2;

    cy.wrap($handle).trigger("pointerdown", {
      button: 0,
      clientX: x,
      clientY: y,
    });
    cy.get("body").trigger("pointermove", { clientY: y, clientX: x + 60 });
    cy.get("body").trigger("pointerup");
  });
  cy.get("[data-part='handle']").should("have.attr", "aria-valuenow", "60");
});

test("it should resize panels with the keyboard in the browser", () => {
  cy.mount(host(false));

  cy.get("[data-part='handle']").focus();
  cy.get("[data-part='handle']").trigger("keydown", { key: "ArrowLeft" });
  cy.get("[data-part='handle']").should("have.attr", "aria-valuenow", "40");
});
