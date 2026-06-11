export interface AvatarIconSizeItem {
  "icon": string;
  "label": string;
}

export interface AvatarIconSize {
  "2xl": AvatarIconSizeItem;
  "2xs": AvatarIconSizeItem;
  "lg": AvatarIconSizeItem;
  "md": AvatarIconSizeItem;
  "sm": AvatarIconSizeItem;
  "xl": AvatarIconSizeItem;
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
