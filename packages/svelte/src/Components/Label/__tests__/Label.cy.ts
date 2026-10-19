// ** Local Imports
import { Label } from "@/Components/Label";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

test("it should render the label text", () => {
  cy.mount(Label, { props: { children: textSnippet("Email") } });

  cy.get("label").should("contain.text", "Email");
});

test("it should render the required asterisk", () => {
  cy.mount(Label, {
    props: { required: true, children: textSnippet("Email") },
  });

  cy.get("label span").should("contain.text", "*");
});
