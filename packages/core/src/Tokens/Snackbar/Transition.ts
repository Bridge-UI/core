export interface SnackbarTransition {
  /**
   * Fade enter/leave transition.
   */
  "fade": string;

  /**
   * No effect (empty token).
   */
  "none": string;

  /**
   * Slide enter/leave transition.
   */
  "slide": string;
}

export const transitionProps: SnackbarTransition = {
  "none": "",
  "fade":
    "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
  "slide":
    "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2 data-[state=open]:opacity-100 data-[state=open]:translate-y-0 data-[state=open]:translate-x-0",
};
