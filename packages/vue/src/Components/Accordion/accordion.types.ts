// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  AccordionColor,
  AccordionSize,
  AccordionValue,
  AccordionVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface AccordionSizeOverrides {}
export interface AccordionColorOverrides {}
export interface AccordionVariantOverrides {}

export interface AccordionClasses {
  /**
   * Classes merged onto the root.
   */
  root?: string;
}

export interface AccordionCustomProps {
  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface AccordionEmits {
  /**
   * Emitted when the expanded value(s) change.
   */
  change: [value: AccordionValue];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: AccordionValue];
}

/**
 * Accordion context root. Compose with `AccordionItem`.
 */
export interface AccordionOwnProps {
  /**
   * Classes for accordion parts.
   *
   * @default undefined
   */
  classes?: AccordionClasses;

  /**
   * Accent color for the expanded indicator and trigger.
   *
   * @default "primary"
   */
  color?: MergeProps<AccordionColor, AccordionColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: AccordionCustomProps;

  /**
   * Disable all items.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Allow more than one item expanded at once.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Density of triggers and content.
   *
   * @default "md"
   */
  size?: MergeProps<AccordionSize, AccordionSizeOverrides>;

  /**
   * Visual layout (flush vs gap/borders).
   *
   * @default "default"
   */
  variant?: MergeProps<AccordionVariant, AccordionVariantOverrides>;
}

export interface AccordionSlots {
  /**
   * The children to render (`AccordionItem`, etc.).
   */
  default?: Slot<undefined>;
}

export type AccordionProps = MergeHtmlProps<
  AccordionOwnProps,
  HTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: AccordionValue;
};
