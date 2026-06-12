// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

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

export interface CardCustomProps {
  /**
   * Props forwarded to the default body container.
   */
  body?: HTMLAttributes;

  /**
   * Props forwarded to the footer container.
   */
  footer?: HTMLAttributes;

  /**
   * Props forwarded to the default title row container.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the root container.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the title container.
   */
  title?: HTMLAttributes;
}

export interface CardOwnProps {
  /**
   * Removes header and footer borders.
   *
   * @default false
   */
  borderless?: boolean;

  /**
   * The classes to apply to the card.
   *
   * @default undefined
   */
  classes?: CardClasses;

  /**
   * Extra props for internal parts (`header`, `title`, `body`, `footer`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: CardCustomProps;

  /**
   * Padding for header, body, and footer (horizontal alignment is shared).
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
   * Shadow size. Only applied when `variant` is `elevated`.
   *
   * @default "sm"
   */
  shadow?: MergeProps<CardShadow, CardShadowOverrides>;

  /**
   * The title to apply to the card.
   *
   * @default undefined
   */
  title?: string;

  /**
   * Visual style of the card.
   *
   * @default "elevated"
   */
  variant?: MergeProps<CardVariant, CardVariantOverrides>;
}

export interface CardSlots {
  /**
   * Content aligned to the right of the title row (e.g. actions or menu).
   */
  action?: Slot<undefined>;

  /**
   * Main body content of the card.
   */
  default?: Slot<undefined>;

  /**
   * The footer content of the card.
   */
  footer?: Slot<undefined>;

  /**
   * Replaces the entire card header area (title row and action).
   */
  header?: Slot<undefined>;

  /**
   * The title of the card.
   */
  title?: Slot<undefined>;
}

export type CardProps = MergeHtmlProps<CardOwnProps, HTMLAttributes>;
