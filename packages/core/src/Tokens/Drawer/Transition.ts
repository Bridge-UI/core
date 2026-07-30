/**
 * Placement-keyed slide transforms for the drawer panel (`transition="slide"`).
 */
export interface DrawerSlidePanel {
  /**
   * Slide from the bottom edge.
   */
  "bottom": string;

  /**
   * Slide from the left edge.
   */
  "left": string;

  /**
   * Slide from the right edge.
   */
  "right": string;

  /**
   * Slide from the top edge.
   */
  "top": string;
}

/**
 * Overlay + panel transition class pair for a drawer transition token.
 */
export interface DrawerTransitionLayer {
  /**
   * Backdrop overlay transition classes.
   */
  "overlay": string;

  /**
   * Dialog panel transition classes.
   * For `slide`, a per-placement map; otherwise a single class string.
   */
  "panel": string | DrawerSlidePanel;
}

/**
 * Drawer enter/leave transition tokens.
 */
export interface DrawerTransition {
  /**
   * Fade enter/leave transition.
   */
  "fade": DrawerTransitionLayer;

  /**
   * No effect (empty token).
   */
  "none": DrawerTransitionLayer;

  /**
   * Slide enter/leave from the placement edge.
   */
  "slide": DrawerTransitionLayer;
}

/**
 * Default drawer transition class maps.
 */
export const transitionProps: DrawerTransition = {
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
  "slide": {
    "overlay":
      "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
    "panel": {
      "top":
        "transition-all duration-300 ease-out motion-reduce:transition-none -translate-y-full data-[state=open]:translate-y-0",
      "left":
        "transition-all duration-300 ease-out motion-reduce:transition-none -translate-x-full data-[state=open]:translate-x-0",
      "right":
        "transition-all duration-300 ease-out motion-reduce:transition-none translate-x-full data-[state=open]:translate-x-0",
      "bottom":
        "transition-all duration-300 ease-out motion-reduce:transition-none translate-y-full data-[state=open]:translate-y-0",
    },
  },
};
