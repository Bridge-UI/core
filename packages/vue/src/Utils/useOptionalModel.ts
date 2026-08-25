// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, type Ref, type WritableComputedRef } from "vue";

/**
 * Optional `v-model` that keeps `defaultValue` when unbound, and stays empty
 * when the parent sets the bound model to `undefined`.
 */
export function useOptionalModel<T>(
  model: Ref<undefined | NoInfer<T>>,
  uncontrolled: Ref<T>,
): WritableComputedRef<T> {
  return computed({
    get: () => {
      return isUndefined(model.value) ? uncontrolled.value : model.value;
    },
    set: (next) => {
      if (isUndefined(model.value)) {
        uncontrolled.value = next;
      }

      model.value = next;
    },
  });
}
