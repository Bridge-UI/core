// ** Local Imports
import { useLabel } from "@/Components/Label/hooks/useLabel";
import type { LabelProps } from "@/Components/Label/label.types";

function Label(props: LabelProps) {
  const { merged, children, rootBind, requiredBind } = useLabel(props, {
    size: "md",
  });

  return (
    <label {...rootBind}>
      {children}

      {merged.required && <span {...requiredBind}>*</span>}
    </label>
  );
}

export default Label;
