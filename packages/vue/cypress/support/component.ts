import { mount } from "cypress/vue";

import { createLucideIconAdapter } from "../../../../examples/adapters/vue/icon-lucide";
import { setIconAdapterForTests } from "../../src/Icons/useIconAdapter";
import "./component.css";

setIconAdapterForTests(createLucideIconAdapter());

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
