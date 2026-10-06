// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

test("it should size panels from defaultSize in the browser", () => {
  cy.mount(
    defineComponent({
      setup() {
        return () =>
          h("div", { style: { width: "600px", height: "200px" } }, [
            h(Resizable, null, () => [
              h(ResizablePanel, { defaultSize: 25 }, () => "Sidebar"),
              h(ResizableHandle),
              h(ResizablePanel, null, () => "Content"),
            ]),
          ]);
      },
    }),
  );

  cy.contains("Sidebar").should("be.visible");
  cy.contains("Sidebar")
    .closest("[data-part='panel']")
    .invoke("outerWidth")
    .should("be.closeTo", 150, 2);
});
