// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useEffect, useRef, type RefObject } from "react";

// ** Core Imports
import { createCalendarWheelNavigator } from "@bridge-ui/core/Domain";

export type UseWheelNavigationOptions = {
  enabled: boolean;
  onNavigate: (direction: 1 | -1) => void;
};

/**
 * Steps previous / next while the wheel is used over `ref`. While enabled, the
 * wheel no longer scrolls the page under the pointer. Pinch-zoom
 * (`ctrlKey`) is left to the browser.
 */
export function useWheelNavigation(
  ref: RefObject<null | HTMLElement>,
  { enabled, onNavigate }: UseWheelNavigationOptions,
) {
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  useEffect(() => {
    const node = ref.current;

    if (!enabled || isNil(node)) {
      return;
    }

    const step = createCalendarWheelNavigator();

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      event.preventDefault();

      const direction = step(event);

      if (direction !== 0) {
        onNavigateRef.current(direction);
      }
    };

    node.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, [ref, enabled]);
}
