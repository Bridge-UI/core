// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

test("it should show a grip and collapse with Enter in the browser", () => {
  cy.mount(
    defineComponent({
      setup() {
        return () =>
          h("div", { style: { width: "600px", height: "200px" } }, [
            h(Resizable, null, () => [
              h(
                ResizablePanel,
                { minSize: 20, collapsible: true },
                () => "One",
              ),
              h(ResizableHandle, { withHandle: true }),
              h(ResizablePanel, null, () => "Two"),
            ]),
          ]);
      },
    }),
  );

  cy.get("[data-part='grip']").should("be.visible");
  cy.get("[data-part='handle']").focus();
  cy.get("[data-part='handle']").trigger("keydown", { key: "Enter" });
  cy.get("[data-part='handle']").should("have.attr", "aria-valuenow", "0");
  cy.contains("One")
    .closest("[data-part='panel']")
    .should("have.attr", "data-collapsed");
});
