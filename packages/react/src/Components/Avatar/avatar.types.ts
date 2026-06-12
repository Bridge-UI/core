// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  AvatarColor,
  AvatarRounded,
  AvatarSize,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface AvatarSizeOverrides {}
export interface AvatarColorOverrides {}
export interface AvatarRoundedOverrides {}

export interface AvatarClasses {
  /**
   * The classes to apply to the fallback.
   */
  fallback?: string;

  /**
   * The classes to apply to the image.
   */
  image?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface AvatarOwnProps {
  /**
   * The alt text for the avatar image.
   *
   * @default undefined
   */
  alt?: string;

  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the avatar.
   *
   * @default undefined
   */
  classes?: AvatarClasses;

  /**
   * The color to apply to the avatar fallback.
   *
   * @default "primary"
   */
  color?: MergeProps<AvatarColor, AvatarColorOverrides>;

  /**
   * The fallback text to display when no image is available.
   *
   * @default undefined
   */
  fallback?: string;

  /**
   * The icon to display as fallback.
   *
   * @default undefined
   */
  icon?: LucideIcon;

  /**
   * The roundedness of the avatar.
   *
   * @default "full"
   */
  rounded?: MergeProps<AvatarRounded, AvatarRoundedOverrides>;

  /**
   * The size of the avatar.
   *
   * @default "md"
   */
  size?: MergeProps<AvatarSize, AvatarSizeOverrides>;

  /**
   * Named slots for avatar regions.
   *
   * @default undefined
   */
  slots?: AvatarSlots;

  /**
   * The source URL for the avatar image.
   *
   * @default undefined
   */
  src?: string;
}

export interface AvatarSlots {
  /**
   * Custom fallback content when no image is available.
   */
  fallback?: ReactNode;
}

export type AvatarProps = MergeHtmlProps<
  AvatarOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
