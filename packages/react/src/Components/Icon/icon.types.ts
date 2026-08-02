// ** External Imports
import type { SVGAttributes } from "react";

// ** Core Imports
import type { IconSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";

export interface IconSizeOverrides {}

export interface IconOwnProps {
  /**
   * Semantic icon name, icon component, or adapter-normalized native value.
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
