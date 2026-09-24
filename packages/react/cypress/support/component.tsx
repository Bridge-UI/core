// ** External Imports
import { mount } from "cypress/react";

// ** Local Imports
import { createLucideIconAdapter } from "@/Adapters/Examples/icon-lucide";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createMockRichTextAdapter } from "@/Adapters/RichText/mockRichTextAdapter";
import { setRichTextAdapterForTests } from "@/Adapters/RichText/useRichTextAdapter";
import "./component.css";

setIconAdapterForTests(createLucideIconAdapter());
setRichTextAdapterForTests(createMockRichTextAdapter());

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
