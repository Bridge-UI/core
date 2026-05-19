// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { LinkProps } from "@/Components/Link/link.types";
import LinkVue from "@/Components/Link/Link.vue";

// ** Exports
export const Link = LinkVue as DefineComponent<LinkProps>;

export { useLink } from "@/Components/Link/composables/useLink";
export type {
  LinkClasses,
  LinkColorOverrides,
  LinkOwnProps,
  LinkPartsProps,
  LinkProps,
  LinkSizeOverrides,
  LinkSlots,
  LinkUnderlineOverrides,
} from "@/Components/Link/link.types";
