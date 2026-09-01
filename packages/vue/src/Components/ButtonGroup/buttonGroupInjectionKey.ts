// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Local Imports
import type { ButtonGroupOwnProps } from "@/Components/ButtonGroup/buttonGroup.types";

/**
 * Button appearance cascaded to nested `Button` children.
 */
export type ButtonGroupContextValue = Pick<
  ButtonGroupOwnProps,
  "size" | "color" | "density" | "rounded" | "variant"
>;

export const BUTTON_GROUP_INJECTION_KEY = Symbol(
  "bridge-button-group",
) as InjectionKey<ComputedRef<ButtonGroupContextValue>>;
