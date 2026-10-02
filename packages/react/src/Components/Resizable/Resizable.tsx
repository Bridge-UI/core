// ** Local Imports
import { useResizable } from "@/Components/Resizable/hooks/useResizable";
import type { ResizableProps } from "@/Components/Resizable/resizable.types";
import { ResizableContext } from "@/Components/Resizable/ResizableContext";

const resizableLibDefaults = {
  disabled: false,
  keyboardStep: 10,
  orientation: "horizontal",
} as const;

function Resizable(props: ResizableProps) {
  const { rootRef, children, rootBind, contextValue } = useResizable(
    props,
    resizableLibDefaults,
  );

  return (
    <ResizableContext.Provider value={contextValue}>
      <div {...rootBind} ref={rootRef}>
        {children}
      </div>
    </ResizableContext.Provider>
  );
}

export default Resizable;
