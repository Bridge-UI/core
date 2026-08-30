// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import {
  computed,
  provide,
  ref,
  useAttrs,
  type Ref,
  type SetupContext,
} from "vue";

// ** Core Imports
import {
  resolveSidebarState,
  shouldToggleDesktopSidebar,
  SIDEBAR_WIDTH_ICON_VAR,
  SIDEBAR_WIDTH_MOBILE_VAR,
  SIDEBAR_WIDTH_VAR,
  toggleSidebarOpen,
} from "@bridge-ui/core/Domain";
import {
  sidebarWidthProps as widthProps,
  type SidebarWidth,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  SidebarProviderEmits,
  SidebarProviderOwnProps,
  SidebarProviderProps,
} from "@/Components/Sidebar/sidebar.types";
import {
  SIDEBAR_INJECTION_KEY,
  type SidebarContextValue,
  type SidebarLayout,
} from "@/Components/Sidebar/sidebarInjectionKey";
import {
  mergePartBind,
  useBreakpoint,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const sidebarProviderBridgeKeys = [
  "classes",
  "customProps",
  "defaultOpen",
] as const satisfies readonly (keyof SidebarProviderOwnProps)[];

type SidebarProviderLibDefaults = LibDefaultsShape<
  SidebarProviderOwnProps,
  "defaultOpen"
>;

type SidebarProviderMerged = MergeLibDefaults<
  SidebarProviderOwnProps,
  SidebarProviderLibDefaults
>;

const defaultLayout: SidebarLayout = {
  panelId: "",
  side: "left",
  variant: "sidebar",
  collapsible: "offcanvas",
};

export function useSidebarProvider(
  props: SidebarProviderOwnProps,
  libDefaults: SidebarProviderLibDefaults,
  openModel: Ref<boolean | undefined>,
  emit: SetupContext<SidebarProviderEmits>["emit"],
) {
  const attrs = useAttrs();
  const breakpoint = useBreakpoint();

  const split = computed(() => {
    return splitComponentProps<
      SidebarProviderProps,
      typeof sidebarProviderBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: sidebarProviderBridgeKeys,
    });
  });

  const { merged, entry: bridgeSidebar } = useBridgeUIComponent<
    SidebarProviderMerged,
    "Sidebar"
  >({
    libDefaults,
    componentName: "Sidebar",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSidebar,
    props: () => split.value.componentProps,
  });

  const isMobile = computed(() => {
    return breakpoint.mobile;
  });

  const internalOpen = ref(merged.value.defaultOpen);
  const openMobile = ref(false);
  const layout = ref<SidebarLayout>({ ...defaultLayout });

  const open = computed(() => {
    return openModel.value ?? internalOpen.value;
  });

  const setOpen = (next: boolean) => {
    if (openModel.value === undefined) {
      internalOpen.value = next;
    }

    openModel.value = next;
    emit("openChange", next);
  };

  const setOpenMobile = (next: boolean) => {
    openMobile.value = next;
  };

  const setLayout = (next: Partial<SidebarLayout>) => {
    const mergedLayout = { ...layout.value, ...next };

    if (
      layout.value.side === mergedLayout.side &&
      layout.value.panelId === mergedLayout.panelId &&
      layout.value.variant === mergedLayout.variant &&
      layout.value.collapsible === mergedLayout.collapsible
    ) {
      return;
    }

    layout.value = mergedLayout;
  };

  const toggleSidebar = () => {
    if (isMobile.value) {
      setOpenMobile(toggleSidebarOpen(openMobile.value));
      return;
    }

    if (!shouldToggleDesktopSidebar(layout.value.collapsible)) {
      return;
    }

    setOpen(toggleSidebarOpen(open.value));
  };

  const state = computed(() => {
    return resolveSidebarState(open.value, layout.value.collapsible);
  });

  const widthItem = computed((): SidebarWidth => {
    return toMerged(widthProps, bridgeSidebar.value?.tokens?.width ?? {});
  });

  const contextValue = computed((): SidebarContextValue => {
    return {
      setOpen,
      setLayout,
      toggleSidebar,
      setOpenMobile,
      open: open.value,
      state: state.value,
      isMobile: isMobile.value,
      openMobile: openMobile.value,
      side: layout.value.side,
      panelId: layout.value.panelId,
      variant: layout.value.variant,
      collapsible: layout.value.collapsible,
    };
  });

  provide(SIDEBAR_INJECTION_KEY, contextValue);

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, [
      "modelValue",
      "onUpdate:modelValue",
    ]);
  });

  const rootBind = computed(() => {
    const inheritedStyle = (
      rootInheritedAttrs.value as { style?: Record<string, string> }
    ).style;

    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      "data-side": layout.value.side,
      class: cn({
        "flex min-h-svh w-full data-[side=right]:flex-row-reverse": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
      style: {
        ...inheritedStyle,
        [SIDEBAR_WIDTH_VAR]: widthItem.value.default,
        [SIDEBAR_WIDTH_ICON_VAR]: widthItem.value.icon,
        [SIDEBAR_WIDTH_MOBILE_VAR]: widthItem.value.mobile,
      },
    });
  });

  return {
    merged,
    rootBind,
  };
}
