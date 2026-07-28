// ** Local Imports
import { useSpinner } from "@/Components/Spinner/hooks/useSpinner";
import type { SpinnerProps } from "@/Components/Spinner/spinner.types";

function Spinner(props: SpinnerProps) {
  const { svgBind, rootBind, trackBind, circleBind, enableTrack } = useSpinner(
    props,
    {
      size: "md",
      thickness: 3.6,
      color: "primary",
      enableTrack: false,
      disableShrink: false,
      variant: "indeterminate",
    },
  );

  return (
    <span {...rootBind}>
      <svg {...svgBind}>
        {enableTrack && trackBind ? <circle {...trackBind} /> : null}
        <circle {...circleBind} />
      </svg>
    </span>
  );
}

export default Spinner;
