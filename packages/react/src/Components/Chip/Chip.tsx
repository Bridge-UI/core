// ** External Imports
import { X } from "lucide-react";

// ** Local Imports
import type { ChipProps } from "@/Components/Chip/chip.types";
import { useChip } from "@/Components/Chip/hooks/useChip";
import { Icon, type IconProps } from "@/Components/Icon";

function Chip({ children, ...props }: ChipProps) {
  const {
    merged,
    rootBind,
    labelBind,
    clearBind,
    clearIconSize,
    handleDismiss,
    handleClearKeyDown,
  } = useChip(props, {
    size: "md",
  });

  const content = children ?? merged.label;

  return (
    <span {...rootBind}>
      {content ? <span {...labelBind}>{content}</span> : null}

      {merged.dismissible ? (
        <span
          {...clearBind}
          onClick={handleDismiss}
          onKeyDown={handleClearKeyDown}
        >
          <Icon
            icon={X}
            {...merged.customProps?.clearIcon}
            size={clearIconSize as IconProps["size"]}
          />
        </span>
      ) : null}
    </span>
  );
}

export default Chip;
