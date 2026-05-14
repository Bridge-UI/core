// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  CardPadding,
  CardRounded,
  CardShadow,
  MergeProps,
} from "@bridge-ui/core";

export interface CardShadowOverrides {}
export interface CardPaddingOverrides {}
export interface CardRoundedOverrides {}

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
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * @default "md"
   */
  rounded?: MergeProps<CardRounded, CardRoundedOverrides>;

  /**
   * The shadow to apply to the card.
   *
   * @default "sm"
   */
  shadow?: MergeProps<CardShadow, CardShadowOverrides>;

  /**
   * The slots to apply to the card.
   *
   * @default undefined
   */
  slots?: CardSlots;
}

export interface CardSlots {
  /**
   * The slot for the footer.
   */
  footer?: ReactNode;

  /**
   * The slot for the header.
   */
  header?: ReactNode;
}
