// ** Local Imports
import type { MenuShadow } from "@/Tokens/Menu/Shadow";
import { shadowProps as menuShadowProps } from "@/Tokens/Menu/Shadow";

/**
 * Popover panels share the Menu panel shadow scale.
 */
export type PopoverShadow = MenuShadow;

export const shadowProps: PopoverShadow = menuShadowProps;
