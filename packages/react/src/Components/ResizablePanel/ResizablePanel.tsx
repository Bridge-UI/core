// ** Local Imports
import { useResizablePanel } from "@/Components/ResizablePanel/hooks/useResizablePanel";
import type { ResizablePanelProps } from "@/Components/ResizablePanel/resizablePanel.types";

const resizablePanelLibDefaults = {
  minSize: 0,
  maxSize: 100,
  collapsedSize: 0,
  collapsible: false,
} as const;

function ResizablePanel(props: ResizablePanelProps) {
  const { children, rootBind, elementRef } = useResizablePanel(
    props,
    resizablePanelLibDefaults,
  );

  return (
    <div {...rootBind} ref={elementRef}>
      {children}
    </div>
  );
}

export default ResizablePanel;
