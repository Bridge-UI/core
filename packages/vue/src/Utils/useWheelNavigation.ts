// ** External Imports
import { isNil } from "es-toolkit/compat";
import { toValue, watchEffect, type MaybeRefOrGetter, type Ref } from "vue";

// ** Core Imports
import { createCalendarWheelNavigator } from "@bridge-ui/core/Domain";

export type UseWheelNavigationOptions = {
  enabled: MaybeRefOrGetter<boolean>;
  onNavigate: (direction: 1 | -1) => void;
};

/**
 * Steps previous / next while the wheel is used over `target`. While enabled,
 * the wheel no longer scrolls the page under the pointer. Pinch-zoom
 * (`ctrlKey`) is left to the browser.
 */
export function useWheelNavigation(
  target: Readonly<Ref<null | HTMLElement>>,
  { enabled, onNavigate }: UseWheelNavigationOptions,
) {
  watchEffect(
    (onCleanup) => {
      const node = target.value;

      if (!toValue(enabled) || isNil(node)) {
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
          onNavigate(direction);
        }
      };

      node.addEventListener("wheel", handleWheel, { passive: false });

      onCleanup(() => {
        node.removeEventListener("wheel", handleWheel);
      });
    },
    { flush: "post" },
  );
}
