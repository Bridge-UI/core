// ** Local Imports
import type { MenuRounded } from "@/Tokens/Menu/Rounded";
import { roundedProps as menuRoundedProps } from "@/Tokens/Menu/Rounded";

/**
 * Popover panels share the Menu panel radius scale.
 */
export type PopoverRounded = MenuRounded;

export const roundedProps: PopoverRounded = menuRoundedProps;
