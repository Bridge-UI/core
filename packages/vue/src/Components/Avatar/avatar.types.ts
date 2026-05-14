// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { Slot } from "vue";

// ** Core Imports
import type {
  AvatarColor,
  AvatarRounded,
  AvatarSize,
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

export interface AvatarProps {
  /**
   * The alt text for the avatar image.
   *
   * @default undefined
   */
  alt?: string;

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
   * The source URL for the avatar image.
   *
   * @default undefined
   */
  src?: string;
}

export interface AvatarSlots {
  /**
   * Custom content to render inside the avatar.
   */
  default?: Slot<undefined>;

  /**
   * Custom fallback content when no image is available.
   */
  fallback?: Slot<undefined>;
}
