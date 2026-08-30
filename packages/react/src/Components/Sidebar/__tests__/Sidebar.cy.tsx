// ** Local Imports
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/Sidebar";

test("it should render the sidebar and inset", () => {
  cy.mount(
    <SidebarProvider>
      <Sidebar>Home</Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        Main
      </SidebarInset>
    </SidebarProvider>,
  );

  cy.contains("Home").should("exist");
  cy.contains("Main").should("be.visible");
  cy.get("button[aria-label='Toggle sidebar']").should("be.visible");
});

test("it should collapse when the trigger is clicked", () => {
  cy.mount(
    <SidebarProvider>
      <Sidebar>Home</Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        Main
      </SidebarInset>
    </SidebarProvider>,
  );

  cy.get("[data-state='expanded']").should("exist");
  cy.get("button[aria-label='Toggle sidebar']").click();
  cy.get("[data-state='collapsed']").should("exist");
});

test("it should render header slot content", () => {
  cy.mount(
    <SidebarProvider>
      <Sidebar
        slots={{
          header: <div>Brand</div>,
        }}
      >
        Nav
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  cy.contains("Brand").should("exist");
});
