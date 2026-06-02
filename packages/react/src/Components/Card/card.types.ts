// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  CardPadding,
  CardRounded,
  CardShadow,
  CardVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface CardShadowOverrides {}
export interface CardPaddingOverrides {}
export interface CardRoundedOverrides {}
export interface CardVariantOverrides {}

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

  /**
   * The classes to apply to the title.
   */
  title?: string;
}

export interface CardPartsProps {
  /**
   * Props forwarded to the default body container.
   */
  body?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the footer container.
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the default title row container.
   */
  header?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root container.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the title container.
   */
  title?: HTMLAttributes<HTMLDivElement>;
}

export interface CardOwnProps {
  /**
   * Removes header and footer borders.
   *
   * @default false
   */
  borderless?: boolean;

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
   * Visual style of the card.
   *
   * @default "elevated"
   */
  variant?: MergeProps<CardVariant, CardVariantOverrides>;

  /**
   * The padding to apply to the card body.
   *
   * @default "medium"
   */
  padding?: MergeProps<CardPadding, CardPaddingOverrides>;

  /**
   * Extra props for internal parts (`header`, `title`, `body`, `footer`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  partsProps?: CardPartsProps;

  /**
   * The roundedness of the card.
   *
   * @default "sm"
   */
  rounded?: MergeProps<CardRounded, CardRoundedOverrides>;

  /**
   * Shadow size. Only applied when `variant` is `elevated`.
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

  /**
   * The title to apply to the card.
   *
   * @default undefined
   */
  title?: string;
}

export interface CardSlots {
  /**
   * Content aligned to the right of the title row (e.g. actions or menu).
   */
  action?: ReactNode;

  /**
   * The footer content of the card.
   */
  footer?: ReactNode;

  /**
   * Replaces the entire card header area (title row and action).
   */
  header?: ReactNode;

  /**
   * The title of the card.
   */
  title?: ReactNode;
}

export type CardProps = MergeHtmlProps<
  CardOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
