// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import type { HTMLAttributes } from "vue";
import { computed, inject, useAttrs } from "vue";

// ** Core Imports
import {
  formatFileUploadStatusLabel,
  getFileUploadItemState,
  resolveFileUploadItemMedia,
  shouldShowFileUploadDescription,
} from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { FILE_UPLOAD_KEY } from "@/Components/FileUpload/fileUploadInjectionKey";
import type { FileUploadItemOwnProps } from "@/Components/FileUploadItem/fileUploadItem.types";

const fileUploadItemBridgeKeys = [
  "index",
  "retry",
  "value",
  "remove",
  "isImage",
  "metaLabel",
  "sizeLabel",
  "previewUrl",
  "orientation",
] as const satisfies readonly (keyof FileUploadItemOwnProps)[];

/**
 * Binds and media for one file card inside `FileUpload`.
 */
export function useFileUploadItem(props: FileUploadItemOwnProps) {
  const attrs = useAttrs();
  const context = inject(FILE_UPLOAD_KEY);

  if (!context) {
    throw new Error("FileUploadItem must be used within FileUpload");
  }

  const split = computed(() => {
    return splitComponentProps<
      FileUploadItemOwnProps,
      typeof fileUploadItemBridgeKeys
    >({
      bridgeKeys: fileUploadItemBridgeKeys,
      props: { ...attrs, ...props } as FileUploadItemOwnProps,
    });
  });

  const orientation = computed(() => {
    return split.value.componentProps.orientation ?? context.value.orientation;
  });

  const orientationItem = computed(() => {
    return get(context.value.orientationItems, orientation.value);
  });

  const state = computed(() => {
    return getFileUploadItemState(split.value.componentProps.value);
  });

  const stateItem = computed(() => {
    const current = state.value;

    return current ? get(context.value.stateItems, current) : undefined;
  });

  const media = computed(() => {
    return resolveFileUploadItemMedia(
      split.value.componentProps.value,
      split.value.componentProps.previewUrl,
    );
  });

  const statusLabel = computed(() => {
    return formatFileUploadStatusLabel(split.value.componentProps.value);
  });

  const showDescription = computed(() => {
    return shouldShowFileUploadDescription(
      split.value.componentProps.value,
      context.value.size,
    );
  });

  const showRetry = computed(() => {
    return state.value === "error" && !isNil(split.value.componentProps.retry);
  });

  const rootBind = computed(() => {
    const itemBind = context.value.getItemBind(
      split.value.componentProps.index,
    );
    const inherited = split.value.inheritedAttrs as HTMLAttributes;
    const override = orientation.value !== context.value.orientation;

    return {
      ...itemBind,
      ...inherited,
      "data-orientation": orientation.value,
      ...(state.value ? { "data-state": state.value } : {}),
      class: cn(
        itemBind.class,
        override ? get(orientationItem.value, "item") : undefined,
        inherited.class,
      ),
    };
  });

  const mediaBind = computed(() => {
    const bind = context.value.mediaBind;
    const override = orientation.value !== context.value.orientation;

    return {
      ...bind,
      class: cn(
        bind.class,
        override ? get(orientationItem.value, "media") : undefined,
        stateItem.value ? get(stateItem.value, "media") : undefined,
      ),
    };
  });

  const contentBind = computed(() => {
    const bind = context.value.contentBind;
    const override = orientation.value !== context.value.orientation;

    return {
      ...bind,
      class: cn(
        bind.class,
        override ? get(orientationItem.value, "content") : undefined,
      ),
    };
  });

  const titleBind = computed(() => {
    const bind = context.value.titleBind;

    return {
      ...bind,
      class: cn(
        bind.class,
        stateItem.value ? get(stateItem.value, "title") : undefined,
      ),
    };
  });

  const descriptionBind = computed(() => {
    const bind = context.value.descriptionBind;

    return {
      ...bind,
      class: cn(
        bind.class,
        stateItem.value ? get(stateItem.value, "description") : undefined,
      ),
    };
  });

  const actionsBind = computed(() => {
    const bind = context.value.actionsBind;
    const override = orientation.value !== context.value.orientation;

    return {
      ...bind,
      class: cn(
        bind.class,
        override ? get(orientationItem.value, "actions") : undefined,
      ),
    };
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
    color: computed(() => context.value.color),
    rounded: computed(() => context.value.rounded),
    disabled: computed(() => context.value.disabled),
    retry: computed(() => split.value.componentProps.retry),
    remove: computed(() => split.value.componentProps.remove),
    name: computed(() => split.value.componentProps.value.name),
  };
}
