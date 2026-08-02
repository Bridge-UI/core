// ** External Imports
import type { Component } from "vue";

// ** Core Imports
import type {
  IconSource as CoreIconSource,
  IconSourceValueOverrides,
  SemanticIconName,
} from "@bridge-ui/core";

/**
 * Renderable icon component accepted by Bridge Icon props.
 */
export type IconElement = Component;

/**
 * Semantic icon name, concrete icon component, or an augmented native value.
 */
export type IconSource = CoreIconSource<IconElement>;

export type { IconSourceValueOverrides, SemanticIconName };
