// ** External Imports
import type { SVGAttributes } from "react";

// ** Core Imports
import type { IconSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Icons";

export interface IconSizeOverrides {}

export interface IconOwnProps {
  /**
   * Semantic icon name (resolved via the icon adapter) or an icon component.
   */
  icon: IconSource;

  /**
   * The size of the icon.
   *
   * @default "md"
   */
  size?: MergeProps<IconSize, IconSizeOverrides>;
}

export type IconProps = MergeHtmlProps<
  IconOwnProps,
  SVGAttributes<SVGSVGElement>
>;
