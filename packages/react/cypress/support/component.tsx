// ** External Imports
import { mount } from "cypress/react";

// ** Local Imports
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createLucideIconAdapter } from "@examples/icon-lucide";
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
