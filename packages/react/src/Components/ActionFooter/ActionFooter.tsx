// ** Local Imports
import type { ActionFooterProps } from "@/Components/ActionFooter/actionFooter.types";
import { useActionFooter } from "@/Components/ActionFooter/hooks/useActionFooter";
import { Button } from "@/Components/Button";

function ActionFooter(props: ActionFooterProps) {
  const {
    rootBind,
    applyLabel,
    cancelLabel,
    applyButtonBind,
    cancelButtonBind,
  } = useActionFooter(props, {
    applyColor: "primary",
    cancelVariant: "flat",
    cancelColor: "secondary",
  });

  return (
    <div {...rootBind}>
      <Button {...cancelButtonBind}>{cancelLabel}</Button>

      <Button {...applyButtonBind}>{applyLabel}</Button>
    </div>
  );
}

export default ActionFooter;
