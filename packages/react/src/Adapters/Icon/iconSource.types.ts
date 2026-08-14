// ** External Imports
import type { ComponentType, SVGAttributes } from "react";

// ** Core Imports
import type {
  IconSource as CoreIconSource,
  IconSourceValueOverrides,
  SemanticIconName,
} from "@bridge-ui/core/Adapters";

/**
 * Renderable icon component accepted by Bridge Icon props.
 */
export type IconElement = ComponentType<SVGAttributes<SVGSVGElement>>;

/**
 * Semantic icon name, concrete icon component, or an augmented native value.
 */
export type IconSource = CoreIconSource<IconElement>;

export type { IconSourceValueOverrides, SemanticIconName };
