// ** Local Imports
import { useResizableHandle } from "@/Components/ResizableHandle/hooks/useResizableHandle";
import type { ResizableHandleProps } from "@/Components/ResizableHandle/resizableHandle.types";

const resizableHandleLibDefaults = {
  disabled: false,
  hideGrip: false,
} as const;

function ResizableHandle(props: ResizableHandleProps) {
  const { slots, gripBind, rootBind, showGrip, elementRef } =
    useResizableHandle(props, resizableHandleLibDefaults);

  return (
    <div {...rootBind} ref={elementRef}>
      {showGrip ? <div {...gripBind}>{slots?.grip}</div> : null}
    </div>
  );
}

export default ResizableHandle;
