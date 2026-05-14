import { mount } from "cypress/react18";

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
