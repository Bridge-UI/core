// ** External Imports
import type { Component } from "vue";

// ** Core Imports
import type {
  IconSource as CoreIconSource,
  SemanticIconName,
} from "@bridge-ui/core";

/**
 * Renderable icon component accepted by Bridge Icon props.
 */
export type IconElement = Component;

/**
 * Semantic icon name or a concrete icon component.
 */
export type IconSource = CoreIconSource<IconElement>;

export type { SemanticIconName };
