// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

test("it should render breadcrumb in the browser", () => {
  cy.mount(
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
      <BreadcrumbItem current>Avatar</BreadcrumbItem>
    </Breadcrumb>,
  );

  cy.get("nav[aria-label='Breadcrumb']").should("exist");
  cy.contains("a", "Home").should("be.visible");
  cy.contains("[aria-current='page']", "Avatar").should("be.visible");
});
