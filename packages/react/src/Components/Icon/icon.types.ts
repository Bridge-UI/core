// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { SVGAttributes } from "react";

// ** Core Imports
import type { IconSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

export interface IconSizeOverrides {}

export interface IconOwnProps {
  /**
   * Lucide icon component.
   */
  icon: LucideIcon;

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
