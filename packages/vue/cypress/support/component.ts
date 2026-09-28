// ** External Imports
import { mount } from "cypress/vue";

// ** Local Imports
import { createMockIconAdapter } from "@/Adapters/Icon/mockIconAdapter";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createMockRichTextAdapter } from "@/Adapters/RichText/mockRichTextAdapter";
import { setRichTextAdapterForTests } from "@/Adapters/RichText/useRichTextAdapter";
import "./component.css";

setIconAdapterForTests(createMockIconAdapter());
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
