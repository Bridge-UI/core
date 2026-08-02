// ** External Imports
import type { HTMLAttributes, ImgHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  AvatarColor,
  AvatarRounded,
  AvatarSize,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

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

export interface AvatarCustomProps {
  /**
   * Props forwarded to the fallback text element.
   *
   * @default undefined
   */
  fallback?: HTMLAttributes;

  /**
   * Props forwarded to the fallback `Icon` (`icon` is set by the avatar).
   *
   * @default undefined
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the image element.
   *
   * @default undefined
   */
  image?: ImgHTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface AvatarOwnProps {
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
   * Extra props for internal parts (`root`, `image`, `fallback`, `icon`).
   *
   * @default undefined
   */
  customProps?: AvatarCustomProps;

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
  icon?: IconSource;

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

export type AvatarProps = MergeHtmlProps<AvatarOwnProps, HTMLAttributes>;
