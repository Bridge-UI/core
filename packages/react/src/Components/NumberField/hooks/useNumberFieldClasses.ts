// ** Local Imports
import type {
  NumberFieldClasses,
  NumberFieldProps,
} from "@/Components/NumberField/numberField.types";
import {
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

type NumberFieldRegistryProps = Pick<NumberFieldProps, "classes">;

export function useNumberFieldClasses(props: NumberFieldRegistryProps) {
  const { entry } = useBridgeUIComponent<
    NumberFieldRegistryProps,
    "NumberField"
  >({
    props,
    componentName: "NumberField",
  });

  return useBridgeUIMergedRegistryClasses<NumberFieldClasses>({
    entry,
    props,
  });
}
