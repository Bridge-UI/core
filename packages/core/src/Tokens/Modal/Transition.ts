export interface ModalTransitionLayer {
  /**
   * Backdrop overlay transition classes.
   */
  "overlay": string;

  /**
   * Dialog panel transition classes.
   */
  "panel": string;
}

export interface ModalTransition {
  /**
   * Fade enter/leave transition.
   */
  "fade": ModalTransitionLayer;

  /**
   * No effect (empty token).
   */
  "none": ModalTransitionLayer;

  /**
   * Scale enter/leave transition.
   */
  "scale": ModalTransitionLayer;

  /**
   * `slide-down` enter/leave transition.
   */
  "slide-down": ModalTransitionLayer;

  /**
   * `slide-up` enter/leave transition.
   */
  "slide-up": ModalTransitionLayer;
}

export const transitionProps: ModalTransition = {
  "none": {
    "panel": "",
    "overlay": "",
  },
  "fade": {
    "panel":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
    "overlay":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
  },
  "scale": {
    "overlay":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
    "panel":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100",
  },
  "slide-up": {
    "overlay":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
    "panel":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 translate-y-4 data-[state=open]:opacity-100 data-[state=open]:translate-y-0",
  },
  "slide-down": {
    "overlay":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
    "panel":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 -translate-y-4 data-[state=open]:opacity-100 data-[state=open]:translate-y-0",
  },
};
