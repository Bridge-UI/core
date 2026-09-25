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
import { derived } from "@/Utils";

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
  "description",
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

  const orientation = derived(() => {
    return componentProps.orientation ?? context.orientation;
  });

  const orientationItem = derived(() => {
    return get(context.orientationItems, orientation);
  });

  const state = derived(() => {
    return getFileUploadItemState(componentProps.value);
  });

  const stateItem = derived(() => {
    return state ? get(context.stateItems, state) : undefined;
  });

  const media = derived(() => {
    return resolveFileUploadItemMedia(
      componentProps.value,
      componentProps.previewUrl,
    );
  });

  const description = derived(() => {
    return componentProps.description;
  });

  const statusLabel = derived(() => {
    if (description) {
      return description;
    }

    return formatFileUploadStatusLabel(componentProps.value);
  });

  const showDescription = derived(() => {
    if (description === null || description === "") {
      return false;
    }

    if (description) {
      return true;
    }

    return shouldShowFileUploadDescription(componentProps.value, context.size);
  });

  const showRetry = derived(() => {
    return state === "error" && !isNil(componentProps.retry);
  });

  const orientationOverride = derived(() => {
    return orientation !== context.orientation;
  });

  const rootBind = derived(() => {
    const itemBind = context.getItemBind(componentProps.index);

    return {
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
  });

  const mediaBind = derived(() => {
    return {
      ...context.mediaBind,
      className: cn(
        context.mediaBind.className,
        orientationOverride ? get(orientationItem, "media") : undefined,
        stateItem ? get(stateItem, "media") : undefined,
      ),
    } as HTMLAttributes<HTMLDivElement>;
  });

  const contentBind = derived(() => {
    return {
      ...context.contentBind,
      className: cn(
        context.contentBind.className,
        orientationOverride ? get(orientationItem, "content") : undefined,
      ),
    } as HTMLAttributes<HTMLDivElement>;
  });

  const titleBind = derived(() => {
    return {
      ...context.titleBind,
      className: cn(
        context.titleBind.className,
        stateItem ? get(stateItem, "title") : undefined,
      ),
    } as HTMLAttributes<HTMLParagraphElement>;
  });

  const descriptionBind = derived(() => {
    return {
      ...context.descriptionBind,
      className: cn(
        context.descriptionBind.className,
        stateItem ? get(stateItem, "description") : undefined,
      ),
    } as HTMLAttributes<HTMLParagraphElement>;
  });

  const actionsBind = derived(() => {
    return {
      ...context.actionsBind,
      className: cn(
        context.actionsBind.className,
        orientationOverride ? get(orientationItem, "actions") : undefined,
      ),
    } as HTMLAttributes<HTMLDivElement>;
  });

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
