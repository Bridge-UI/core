// ** Local Imports
import { useLabel } from "@/Components/Label/hooks/useLabel";
import type { LabelProps } from "@/Components/Label/label.types";

function Label(props: LabelProps) {
  const { rootBind, requiredBind, showRequired } = useLabel(props);

  return (
    <label {...rootBind}>
      {props.children}

      {showRequired && <span {...requiredBind}>*</span>}
    </label>
  );
}

export default Label;
