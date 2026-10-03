// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

test("it should size panels from defaultSize in the browser", () => {
  cy.mount(
    <div style={{ width: 600, height: 200 }}>
      <Resizable>
        <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Content</ResizablePanel>
      </Resizable>
    </div>,
  );

  cy.contains("Sidebar").should("be.visible");
  cy.contains("Sidebar")
    .closest("[data-part='panel']")
    .invoke("outerWidth")
    .should("be.closeTo", 150, 2);
});
