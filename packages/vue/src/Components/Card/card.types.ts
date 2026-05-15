// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type {
  CardPadding,
  CardRounded,
  CardShadow,
  MergeProps,
} from "@bridge-ui/core";

export interface CardPaddingOverrides {}
export interface CardRoundedOverrides {}
export interface CardShadowOverrides {}

export interface CardClasses {
  /**
   * The classes to apply to the body.
   */
  body?: string;

  /**
   * The classes to apply to the footer.
   */
  footer?: string;

  /**
   * The classes to apply to the header.
   */
  header?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface CardProps {
  /**
   * The classes to apply to the card.
   *
   * @default undefined
   */
  classes?: CardClasses;

  /**
   * The padding to apply to the card.
   *
   * @default "medium"
   */
  padding?: MergeProps<CardPadding, CardPaddingOverrides>;

  /**
   * The roundedness of the card.
   *
   * @default "sm"
   */
  rounded?: MergeProps<CardRounded, CardRoundedOverrides>;

  /**
   * The shadow to apply to the card.
   *
   * @default "sm"
   */
  shadow?: MergeProps<CardShadow, CardShadowOverrides>;
}

export interface CardSlots {
  /**
   * The main body content of the card.
   */
  default?: Slot<undefined>;

  /**
   * The footer content of the card.
   */
  footer?: Slot<undefined>;

  /**
   * The header content of the card.
   */
  header?: Slot<undefined>;
}
