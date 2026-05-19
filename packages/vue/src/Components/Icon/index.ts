// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";
import IconVue from "@/Components/Icon/Icon.vue";

// ** Exports
export const Icon = IconVue as DefineComponent<IconProps>;

export { useIcon } from "@/Components/Icon/composables/useIcon";
export type {
  IconOwnProps,
  IconProps,
  IconSizeOverrides,
} from "@/Components/Icon/icon.types";
