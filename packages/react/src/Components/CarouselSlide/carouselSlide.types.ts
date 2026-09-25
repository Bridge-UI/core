// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface CarouselSlideClasses {
  /**
   * Classes merged onto the slide root.
   */
  root?: string;
}

export interface CarouselSlideCustomProps {
  /**
   * Props forwarded to the slide root.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * One slide inside `Carousel`.
 */
export interface CarouselSlideOwnProps {
  /**
   * Slide content.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for the slide.
   *
   * @default undefined
   */
  classes?: CarouselSlideClasses;

  /**
   * Extra props for the slide root.
   *
   * @default undefined
   */
  customProps?: CarouselSlideCustomProps;
}

export type CarouselSlideProps = MergeHtmlProps<
  CarouselSlideOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
