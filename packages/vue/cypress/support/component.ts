import { mount } from "cypress/vue";

import "@/theme.css";

declare global {
  const test: Mocha.TestFunction;

  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

globalThis.test = it;

Cypress.Commands.add("mount", mount);
