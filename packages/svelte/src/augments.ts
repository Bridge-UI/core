// ** Local Imports
import type { ButtonClasses, ButtonOwnProps } from "@/Components/Button";
import type { IconOwnProps } from "@/Components/Icon";
import type { LabelClasses, LabelOwnProps } from "@/Components/Label";
import type { SliderClasses, SliderOwnProps } from "@/Components/Slider";

declare module "@bridge-ui/core/Config" {
  interface ButtonConfigOverrides {
    classes: ButtonClasses;
    defaultProps: Partial<
      Pick<ButtonOwnProps, "size" | "color" | "density" | "rounded" | "variant">
    >;
  }

  interface IconConfigOverrides {
    defaultProps: Partial<Pick<IconOwnProps, "size">>;
  }

  interface LabelConfigOverrides {
    classes: LabelClasses;
    defaultProps: Partial<Pick<LabelOwnProps, "size" | "required">>;
  }

  interface SliderConfigOverrides {
    classes: SliderClasses;
    defaultProps: Partial<
      Pick<
        SliderOwnProps,
        | "max"
        | "min"
        | "size"
        | "step"
        | "color"
        | "rounded"
        | "showStops"
        | "showTooltip"
        | "hideErrorMessage"
        | "showDescriptionOnError"
      >
    >;
  }
}
