// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { TabsContext } from "@/Components/Tabs/TabsContext";
import { useTabs } from "@/Components/Tabs/hooks/useTabs";
import type { TabsProps } from "@/Components/Tabs/tabs.types";

const tabsLibDefaults = {
  size: "md",
  variant: "line",
  color: "primary",
  keepMounted: true,
  activation: "automatic",
  orientation: "horizontal",
} as const;

function Tabs(props: TabsProps) {
  const { children, rootBind, tabItems, contextValue } = useTabs(
    props,
    tabsLibDefaults,
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div {...rootBind}>
        {tabItems.length > 0 ? (
          <>
            <TabList {...props.customProps?.tabList}>
              {tabItems.map((item) => (
                <Tab
                  key={item.value}
                  value={item.value}
                  slots={item.slots}
                  endIcon={item.endIcon}
                  disabled={item.disabled}
                  startIcon={item.startIcon}
                  {...props.customProps?.tab}
                >
                  {item.label}
                </Tab>
              ))}
            </TabList>

            {tabItems.map((item) => (
              <TabPanel
                key={item.value}
                value={item.value}
                keepMounted={item.keepMounted}
                {...props.customProps?.tabPanel}
              >
                {item.panel}
              </TabPanel>
            ))}
          </>
        ) : null}

        {children}
      </div>
    </TabsContext.Provider>
  );
}

export default Tabs;
