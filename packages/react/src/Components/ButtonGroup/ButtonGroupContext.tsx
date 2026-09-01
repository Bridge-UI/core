// ** External Imports
import { createContext, useContext } from "react";

// ** Local Imports
import type { ButtonGroupOwnProps } from "@/Components/ButtonGroup/buttonGroup.types";

/**
 * Button appearance cascaded to nested `Button` children.
 */
export type ButtonGroupContextValue = Pick<
  ButtonGroupOwnProps,
  "size" | "color" | "density" | "rounded" | "variant"
>;

export const ButtonGroupContext = createContext<null | ButtonGroupContextValue>(
  null,
);

/**
 * Reads the nearest `ButtonGroup` context, or `null` outside a group.
 */
export function useButtonGroupContext() {
  return useContext(ButtonGroupContext);
}
