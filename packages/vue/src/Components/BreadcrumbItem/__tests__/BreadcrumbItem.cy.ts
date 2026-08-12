// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

test("it should render breadcrumb item in the browser", () => {
  cy.mount(Breadcrumb, {
    slots: {
      default: () => [
        h(BreadcrumbItem, { href: "/" }, () => "Home"),
        h(BreadcrumbItem, { current: true }, () => "Page"),
      ],
    },
  });

  cy.contains("a", "Home").should("be.visible");
  cy.get("[aria-current='page']").should("contain.text", "Page");
});
