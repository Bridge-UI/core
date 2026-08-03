// ** Local Imports
import { OtpField } from "@/Components/OtpField";

test("it should render pin inputs", () => {
  cy.mount(OtpField, { attrs: { "aria-label": "Code" } });

  cy.get('input[aria-label^="Digit"]').should("have.length", 6);
});

test("it should render a label when label prop is provided", () => {
  cy.mount(OtpField, {
    attrs: { "aria-label": "Code" },
    props: { label: "Verification code" },
  });

  cy.contains("Verification code").should("be.visible");
});

test("it should accept typed digits", () => {
  cy.mount(OtpField, {
    props: { length: 4 },
    attrs: { "aria-label": "Code" },
  });

  cy.get('input[aria-label="Digit 1 of 4"]').type("1");
  cy.get('input[aria-label="Digit 1 of 4"]').should("have.value", "1");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(OtpField, {
    props: { disabled: true },
    attrs: { "aria-label": "Code" },
  });

  cy.get("input").each(($input) => {
    cy.wrap($input).should("be.disabled");
  });
});

test("it should show error message when error is set", () => {
  cy.mount(OtpField, {
    attrs: { "aria-label": "Code" },
    props: {
      error: true,
      label: "Code",
      errorMessage: "Invalid code",
    },
  });

  cy.contains("Invalid code").should("be.visible");
});
