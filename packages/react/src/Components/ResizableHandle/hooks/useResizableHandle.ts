// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { KeyboardEvent, PointerEvent } from "react";
import { useId, useLayoutEffect, useRef } from "react";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import {
  useResizableContext,
  type ResizableHandleEntry,
} from "@/Components/Resizable/ResizableContext";
import type {
  ResizableHandleOwnProps,
  ResizableHandleProps,
} from "@/Components/ResizableHandle/resizableHandle.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizableHandleBridgeKeys = [
  "slots",
  "classes",
  "disabled",
  "hideGrip",
  "customProps",
] as const satisfies readonly (keyof ResizableHandleOwnProps)[];

type ResizableHandleLibDefaults = LibDefaultsShape<
  ResizableHandleOwnProps,
  "disabled" | "hideGrip"
>;

type ResizableHandleMerged = MergeLibDefaults<
  ResizableHandleOwnProps,
  ResizableHandleLibDefaults
>;

const rootEventKeys = ["onKeyDown", "onPointerDown"] as const;

export function useResizableHandle(
  props: ResizableHandleProps,
  libDefaults: ResizableHandleLibDefaults,
) {
  const handleUid = useId();
  const group = useResizableContext();
  const resolveMessage = useResolveMessage();

  const elementRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<ResizableHandleEntry>({ element: null });

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ResizableHandleProps,
    typeof resizableHandleBridgeKeys
  >({
    props,
    bridgeKeys: resizableHandleBridgeKeys,
  });

  const { merged, entry: bridgeHandle } = useBridgeUIComponent<
    ResizableHandleMerged,
    "ResizableHandle"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ResizableHandle",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeHandle,
    props: componentProps,
  });

  useLayoutEffect(() => {
    entryRef.current = { element: elementRef.current };
  });

  useLayoutEffect(() => {
    return group.registerHandle(handleUid, entryRef);
  }, [handleUid, group.registerHandle]);

  const slots = derived(() => {
    return props.slots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const state = derived(() => {
    return group.getHandleState(handleUid);
  });

  const disabled = derived(() => {
    return group.disabled || merged.disabled === true;
  });

  const dragging = derived(() => {
    return group.draggingHandleId === handleUid;
  });

  const showGrip = derived(() => {
    return merged.hideGrip !== true;
  });

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    inheritedAttrs.onPointerDown?.(event);

    if (
      disabled ||
      event.defaultPrevented ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    group.startDrag(handleUid, event);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    inheritedAttrs.onKeyDown?.(event);

    if (disabled || event.defaultPrevented) {
      return;
    }

    if (group.resizeFromKey(handleUid, event.key)) {
      event.preventDefault();
    }
  };

  const rootBind = derived(() => {
    return mergePartBind({}, omit(inheritedAttrs, [...rootEventKeys]), {
      ...state?.aria,
      onKeyDown,
      onPointerDown,
      "data-part": "handle",
      role: "separator" as const,
      tabIndex: disabled ? -1 : 0,
      "aria-controls": state?.controls,
      "data-orientation": group.orientation,
      "aria-disabled": disabled || undefined,
      "data-dragging": dragging ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      "aria-label": resolveMessage("Resize panels"),
      "aria-orientation":
        group.orientation === "vertical"
          ? ("horizontal" as const)
          : ("vertical" as const),
      className: cn({
        [get(group.orientationItem, "handle") ?? ""]: true,
        [get(group.orientationItem, "handleDisabled") ?? ""]: disabled,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const gripBind = derived(() => {
    return mergePartBind(
      customProps?.grip,
      {},
      {
        "aria-hidden": true,
        "data-part": "grip",
        className: cn({
          [get(group.orientationItem, "grip") ?? ""]: true,
          [get(mergedClasses, "grip") ?? ""]: true,
        }),
      },
    );
  });

  return {
    slots,
    dragging,
    disabled,
    gripBind,
    rootBind,
    showGrip,
    elementRef,
    id: handleUid,
    index: state?.index ?? -1,
  };
}
