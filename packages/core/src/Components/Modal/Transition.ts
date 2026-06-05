export interface ModalTransitionLayer {
  panel: string;
  overlay: string;
}

// prettier-ignore
export interface ModalTransition {
  "none": ModalTransitionLayer;
  "fade": ModalTransitionLayer;
  "scale": ModalTransitionLayer;
  "slide-up": ModalTransitionLayer;
  "slide-down": ModalTransitionLayer;
}

// prettier-ignore
export const transitionProps: ModalTransition = {
  "none": {
    "panel": "",
    "overlay": "",
  },
  "fade": {
    "panel": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
    "overlay": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
  },
  "scale": {
    "panel": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100",
    "overlay": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
  },
  "slide-up": {
    "panel": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 translate-y-4 data-[state=open]:opacity-100 data-[state=open]:translate-y-0",
    "overlay": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
  },
  "slide-down": {
    "panel": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 -translate-y-4 data-[state=open]:opacity-100 data-[state=open]:translate-y-0",
    "overlay": "transition-all duration-300 ease-out motion-reduce:transition-none opacity-0 data-[state=open]:opacity-100",
  },
};
