import { toValue, type MaybeRefOrGetter } from "vue";

// ** Local Imports
import type {
  NumberFieldClasses,
  NumberFieldOwnProps,
} from "@/Components/NumberField/numberField.types";
import {
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

type NumberFieldRegistryProps = Pick<NumberFieldOwnProps, "classes">;

export function useNumberFieldClasses(
  props: MaybeRefOrGetter<NumberFieldRegistryProps>,
) {
  const { entry } = useBridgeUIComponent<
    NumberFieldRegistryProps,
    "NumberField"
  >({
    props: () => toValue(props),
    componentName: "NumberField",
  });

  return useBridgeUIMergedRegistryClasses<NumberFieldClasses>({
    entry,
    props: () => toValue(props),
  });
}
