// ** External Imports
import type { Component } from "svelte";

// ** Core Imports
import type {
  IconSource as CoreIconSource,
  IconSourceValueOverrides,
  SemanticIconName,
} from "@bridge-ui/core/Adapters";

/**
 * Renderable icon component accepted by Bridge Icon props.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- icon libraries type their own props
export type IconElement = Component<any>;

/**
 * Semantic icon name, concrete icon component, or an augmented native value.
 */
export type IconSource = CoreIconSource<IconElement>;

export type { IconSourceValueOverrides, SemanticIconName };
