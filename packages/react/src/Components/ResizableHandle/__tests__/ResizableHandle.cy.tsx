// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

test("it should show a grip and collapse with Enter in the browser", () => {
  cy.mount(
    <div style={{ width: 600, height: 200 }}>
      <Resizable>
        <ResizablePanel collapsible minSize={20}>
          One
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Two</ResizablePanel>
      </Resizable>
    </div>,
  );

  cy.get("[data-part='grip']").should("be.visible");
  cy.get("[data-part='handle']").focus();
  cy.get("[data-part='handle']").trigger("keydown", { key: "Enter" });
  cy.get("[data-part='handle']").should("have.attr", "aria-valuenow", "0");
  cy.contains("One")
    .closest("[data-part='panel']")
    .should("have.attr", "data-collapsed");
});
