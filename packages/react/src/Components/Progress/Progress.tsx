// ** Local Imports
import { useProgress } from "@/Components/Progress/hooks/useProgress";
import type { ProgressProps } from "@/Components/Progress/progress.types";

function Progress(props: ProgressProps) {
  const { barBind, isBuffer, rootBind, trackBind, bufferBind } = useProgress(
    props,
    {
      size: "md",
      rounded: "full",
      color: "primary",
      variant: "indeterminate",
    },
  );

  return (
    <div {...rootBind}>
      <div {...trackBind} />
      {isBuffer && bufferBind ? <div {...bufferBind} /> : null}
      <div {...barBind} />
    </div>
  );
}

export default Progress;
