// ** External Imports
import { getContext, hasContext, setContext } from "svelte";

// ** Core Imports
import type {
  ButtonColor,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@bridge-ui/core/Tokens";

/**
 * Button appearance cascaded to nested `Button` children.
 */
export type ButtonGroupContextValue = {
  color?: keyof ButtonColor;
  density?: keyof ButtonDensity;
  rounded?: keyof ButtonRounded;
  size?: keyof ButtonSize;
  variant?: keyof ButtonVariant;
};

const BUTTON_GROUP_CONTEXT_KEY = Symbol("bridge-button-group");

/**
 * Registers a getter for the group appearance. Call during initialisation.
 */
export function setButtonGroupContext(value: () => ButtonGroupContextValue) {
  setContext(BUTTON_GROUP_CONTEXT_KEY, value);
}

/**
 * Getter for the nearest `ButtonGroup` appearance, or `null` outside one.
 * Call during initialisation.
 */
export function getButtonGroupContext():
  null | (() => ButtonGroupContextValue) {
  if (!hasContext(BUTTON_GROUP_CONTEXT_KEY)) {
    return null;
  }

  return getContext(BUTTON_GROUP_CONTEXT_KEY);
}
