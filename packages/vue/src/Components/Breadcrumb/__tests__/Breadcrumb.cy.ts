// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

test("it should render breadcrumb in the browser", () => {
  cy.mount(Breadcrumb, {
    slots: {
      default: () => [
        h(BreadcrumbItem, { href: "/" }, () => "Home"),
        h(BreadcrumbItem, { href: "/docs" }, () => "Docs"),
        h(BreadcrumbItem, { current: true }, () => "Avatar"),
      ],
    },
  });

  cy.get("nav[aria-label='Breadcrumb']").should("exist");
  cy.contains("a", "Home").should("be.visible");
  cy.contains("[aria-current='page']", "Avatar").should("be.visible");
});
