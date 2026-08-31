// ** Local Imports
import { Drawer } from "@/Components/Drawer";
import { useSidebarShell } from "@/Components/Sidebar/hooks/useSidebarShell";
import type { SidebarProps } from "@/Components/Sidebar/sidebar.types";
import { hasNamedSlot } from "@/Utils";

const sidebarLibDefaults = {
  side: "left",
  variant: "sidebar",
  ariaLabel: "Sidebar",
  collapsible: "offcanvas",
} as const;

function SidebarPanelBody({
  slots,
  children,
  headerBind,
  footerBind,
  contentBind,
}: Pick<
  ReturnType<typeof useSidebarShell>,
  "slots" | "children" | "footerBind" | "headerBind" | "contentBind"
>) {
  return (
    <>
      {hasNamedSlot(slots, "header") ? (
        <div {...headerBind}>{slots?.header}</div>
      ) : null}

      <div {...contentBind}>{children}</div>

      {hasNamedSlot(slots, "footer") ? (
        <div {...footerBind}>{slots?.footer}</div>
      ) : null}
    </>
  );
}

function Sidebar(props: SidebarProps) {
  const {
    slots,
    merged,
    panelId,
    gapBind,
    children,
    rootBind,
    isMobile,
    asideBind,
    panelBind,
    headerBind,
    footerBind,
    openMobile,
    contentBind,
    mobileWidth,
    showAsDrawer,
    setOpenMobile,
  } = useSidebarShell(props, sidebarLibDefaults);

  const body = (
    <SidebarPanelBody
      slots={slots}
      children={children}
      headerBind={headerBind}
      footerBind={footerBind}
      contentBind={contentBind}
    />
  );

  return (
    <>
      <div {...rootBind}>
        <div {...gapBind} />

        <aside {...asideBind}>
          <div {...panelBind}>{showAsDrawer ? null : body}</div>
        </aside>
      </div>

      {isMobile ? (
        <Drawer
          show={openMobile}
          placement={merged.side}
          ariaLabel={merged.ariaLabel}
          onShowChange={setOpenMobile}
          customProps={{
            panel: {
              className: "p-0",
              id: showAsDrawer ? panelId : undefined,
              style: {
                width: mobileWidth,
                maxWidth: `min(${mobileWidth}, 88vw)`,
              },
            },
          }}
        >
          <div {...panelBind}>{showAsDrawer ? body : null}</div>
        </Drawer>
      ) : null}
    </>
  );
}

export default Sidebar;
