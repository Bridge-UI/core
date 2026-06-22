export interface AvatarIconSizeItem {
  /**
   * Icon size classes inside the avatar.
   */
  "icon": string;

  /**
   * Fallback label typography inside the avatar.
   */
  "label": string;
}

export interface AvatarIconSize {
  /**
   * Size scale token `2xl`.
   */
  "2xl": AvatarIconSizeItem;

  /**
   * Size scale token `2xs`.
   */
  "2xs": AvatarIconSizeItem;

  /**
   * Size scale token `lg`.
   */
  "lg": AvatarIconSizeItem;

  /**
   * Size scale token `md`.
   */
  "md": AvatarIconSizeItem;

  /**
   * Size scale token `sm`.
   */
  "sm": AvatarIconSizeItem;

  /**
   * Size scale token `xl`.
   */
  "xl": AvatarIconSizeItem;

  /**
   * Size scale token `xs`.
   */
  "xs": AvatarIconSizeItem;
}

export const iconSizeProps: AvatarIconSize = {
  "xs": {
    "icon": "w-5 h-5",
    "label": "text-xs",
  },
  "sm": {
    "icon": "w-6 h-6",
    "label": "text-sm",
  },
  "lg": {
    "icon": "w-8 h-8",
    "label": "text-lg",
  },
  "xl": {
    "icon": "w-9 h-9",
    "label": "text-xl",
  },
  "2xs": {
    "icon": "w-4 h-4",
    "label": "text-2xs",
  },
  "md": {
    "icon": "w-7 h-7",
    "label": "text-base",
  },
  "2xl": {
    "icon": "w-12 h-12",
    "label": "text-2xl",
  },
};
