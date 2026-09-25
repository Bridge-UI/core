// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import type { HTMLAttributes } from "react";

// ** Core Imports
import {
  formatFileUploadStatusLabel,
  getFileUploadItemState,
  resolveFileUploadItemMedia,
  shouldShowFileUploadDescription,
} from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useFileUploadItemContext } from "@/Components/FileUpload/FileUploadContext";
import type { FileUploadItemProps } from "@/Components/FileUploadItem/fileUploadItem.types";

const fileUploadItemBridgeKeys = [
  "index",
  "retry",
  "slots",
  "value",
  "remove",
  "isImage",
  "metaLabel",
  "sizeLabel",
  "previewUrl",
  "orientation",
] as const satisfies readonly (keyof FileUploadItemProps)[];

/**
 * Binds and media for one file card inside `FileUpload`.
 */
export function useFileUploadItem(props: FileUploadItemProps) {
  const context = useFileUploadItemContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    FileUploadItemProps,
    typeof fileUploadItemBridgeKeys
  >({
    props,
    bridgeKeys: fileUploadItemBridgeKeys,
  });

  const orientation = componentProps.orientation ?? context.orientation;
  const orientationItem = get(context.orientationItems, orientation);
  const state = getFileUploadItemState(componentProps.value);
  const stateItem = state ? get(context.stateItems, state) : undefined;
  const media = resolveFileUploadItemMedia(
    componentProps.value,
    componentProps.previewUrl,
  );
  const statusLabel = formatFileUploadStatusLabel(componentProps.value);
  const showDescription = shouldShowFileUploadDescription(
    componentProps.value,
    context.size,
  );
  const showRetry = state === "error" && !isNil(componentProps.retry);
  const orientationOverride = orientation !== context.orientation;
  const itemBind = context.getItemBind(componentProps.index);

  const rootBind = {
    ...itemBind,
    ...inheritedAttrs,
    "data-orientation": orientation,
    ...(state ? { "data-state": state } : {}),
    className: cn(
      itemBind.className,
      orientationOverride ? get(orientationItem, "item") : undefined,
      inheritedAttrs.className,
    ),
  } as HTMLAttributes<HTMLLIElement>;

  const mediaBind: HTMLAttributes<HTMLDivElement> = {
    ...context.mediaBind,
    className: cn(
      context.mediaBind.className,
      orientationOverride ? get(orientationItem, "media") : undefined,
      stateItem ? get(stateItem, "media") : undefined,
    ),
  };

  const contentBind: HTMLAttributes<HTMLDivElement> = {
    ...context.contentBind,
    className: cn(
      context.contentBind.className,
      orientationOverride ? get(orientationItem, "content") : undefined,
    ),
  };

  const titleBind: HTMLAttributes<HTMLParagraphElement> = {
    ...context.titleBind,
    className: cn(
      context.titleBind.className,
      stateItem ? get(stateItem, "title") : undefined,
    ),
  };

  const descriptionBind: HTMLAttributes<HTMLParagraphElement> = {
    ...context.descriptionBind,
    className: cn(
      context.descriptionBind.className,
      stateItem ? get(stateItem, "description") : undefined,
    ),
  };

  const actionsBind: HTMLAttributes<HTMLDivElement> = {
    ...context.actionsBind,
    className: cn(
      context.actionsBind.className,
      orientationOverride ? get(orientationItem, "actions") : undefined,
    ),
  };

  return {
    media,
    rootBind,
    showRetry,
    titleBind,
    mediaBind,
    contentBind,
    actionsBind,
    statusLabel,
    descriptionBind,
    showDescription,
    color: context.color,
    rounded: context.rounded,
    disabled: context.disabled,
    retry: componentProps.retry,
    remove: componentProps.remove,
    end: componentProps.slots?.end,
    name: componentProps.value.name,
    start: componentProps.slots?.start,
  };
}
