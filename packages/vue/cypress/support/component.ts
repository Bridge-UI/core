// ** External Imports
import { mount } from "cypress/vue";

// ** Local Imports
import { createLucideIconAdapter } from "@/Adapters/Examples/icon-lucide";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import "./component.css";

setIconAdapterForTests(createLucideIconAdapter());

declare global {
  // Cypress Chainable is ambient-namespace augmentation only.
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Cypress API
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

globalThis.test = it;

Cypress.Commands.add("mount", mount);

export {};
