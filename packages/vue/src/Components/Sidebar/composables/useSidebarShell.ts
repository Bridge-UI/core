// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, useAttrs, useId, useSlots, watch } from "vue";

// ** Core Imports
import {
  getSidebarPanelId,
  resolveSidebarCollapsibleData,
  shouldRenderSidebarAsDrawer,
} from "@bridge-ui/core/Domain";
import {
  sidebarCollapsibleProps as collapsibleProps,
  sidebarSideProps as sideProps,
  sidebarVariantProps as variantProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";
import type {
  SidebarOwnProps,
  SidebarProps,
} from "@/Components/Sidebar/sidebar.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const sidebarBridgeKeys = [
  "side",
  "classes",
  "variant",
  "ariaLabel",
  "collapsible",
  "customProps",
] as const satisfies readonly (keyof SidebarOwnProps)[];

type SidebarLibDefaults = LibDefaultsShape<
  SidebarOwnProps,
  "side" | "variant" | "ariaLabel" | "collapsible"
>;

type SidebarMerged = MergeLibDefaults<SidebarOwnProps, SidebarLibDefaults>;

export function useSidebarShell(
  props: SidebarOwnProps,
  libDefaults: SidebarLibDefaults,
) {
  const vueId = useId();
  const panelId = getSidebarPanelId(`bridge-sidebar${vueId}`);
  const attrs = useAttrs();
  const slots = useSlots();
  const sidebar = useSidebar();

  const split = computed(() => {
    return splitComponentProps<SidebarProps, typeof sidebarBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: sidebarBridgeKeys,
    });
  });

  const { merged, entry: bridgeSidebar } = useBridgeUIComponent<
    SidebarMerged,
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

  watch(
    () => ({
      panelId,
      side: merged.value.side,
      variant: merged.value.variant,
      collapsible: merged.value.collapsible,
    }),
    (layout) => {
      sidebar.value.setLayout(layout);
    },
    { immediate: true },
  );

  const variantItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSidebar.value?.tokens?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const collapsibleItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      collapsibleProps,
      bridgeSidebar.value?.tokens?.collapsible,
    );

    return get(classes, merged.value.collapsible);
  });

  const sideClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sideProps,
      bridgeSidebar.value?.tokens?.side,
    );

    return get(classes, merged.value.side);
  });

  const collapsibleData = computed(() => {
    return resolveSidebarCollapsibleData(
      sidebar.value.state,
      merged.value.collapsible,
    );
  });

  const showAsDrawer = computed(() => {
    return (
      shouldRenderSidebarAsDrawer(sidebar.value.isMobile) &&
      sidebar.value.openMobile
    );
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      "data-side": merged.value.side,
      "data-state": sidebar.value.state,
      "data-variant": merged.value.variant,
      "data-collapsible": collapsibleData.value,
      "data-mobile": sidebar.value.isMobile ? "true" : "false",
      class: cn({
        "group peer hidden text-dark-900 md:block dark:text-dark-100": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const gapBind = computed(() => {
    return mergePartBind(
      customProps.value?.gap,
      {},
      cn({
        [get(variantItem.value, "gap") ?? ""]: true,
        [get(collapsibleItem.value, "gap") ?? ""]: true,
        [get(mergedClasses.value, "gap") ?? ""]: true,
      }),
    );
  });

  const asideBind = computed(() => {
    const offcanvasCollapsed = collapsibleData.value === "offcanvas";

    return mergePartBind(
      {},
      {},
      {
        "data-side": merged.value.side,
        "aria-label": merged.value.ariaLabel,
        inert: offcanvasCollapsed ? true : undefined,
        id: showAsDrawer.value ? undefined : panelId,
        class: cn({
          "fixed inset-y-0 z-10 hidden h-full w-[var(--bridge-sidebar-width)] overflow-hidden transition-[left,right,width] duration-200 ease-linear md:flex": true,
          [sideClass.value ?? ""]: true,
          [get(collapsibleItem.value, "panel") ?? ""]: true,
        }),
      },
    );
  });

  const panelBind = computed(() => {
    return mergePartBind(
      customProps.value?.panel,
      {},
      cn({
        "flex h-full w-full flex-col overflow-hidden": true,
        [get(variantItem.value, "panel") ?? ""]: true,
        [get(mergedClasses.value, "panel") ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex shrink-0 flex-col gap-2 px-2 py-2.5": true,
        [get(mergedClasses.value, "header") ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      customProps.value?.content,
      {},
      cn({
        "bridge-scroll-fade-y flex min-h-0 flex-1 flex-col overflow-y-auto": true,
        [get(mergedClasses.value, "content") ?? ""]: true,
      }),
    );
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "flex shrink-0 flex-col gap-2 px-2 py-2.5": true,
        [get(mergedClasses.value, "footer") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    panelId,
    gapBind,
    rootBind,
    asideBind,
    panelBind,
    headerBind,
    footerBind,
    contentBind,
    showAsDrawer,
    isMobile: computed(() => {
      return sidebar.value.isMobile;
    }),
    openMobile: computed(() => {
      return sidebar.value.openMobile;
    }),
    setOpenMobile: (next: boolean) => {
      sidebar.value.setOpenMobile(next);
    },
  };
}
