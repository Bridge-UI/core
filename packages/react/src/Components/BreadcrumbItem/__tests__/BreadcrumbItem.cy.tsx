// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

test("it should render breadcrumb item in the browser", () => {
  cy.mount(
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>Page</BreadcrumbItem>
    </Breadcrumb>,
  );

  cy.contains("a", "Home").should("be.visible");
  cy.get("[aria-current='page']").should("contain.text", "Page");
});
