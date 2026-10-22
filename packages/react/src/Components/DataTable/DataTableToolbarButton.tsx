// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import { Button } from "@/Components/Button";
import type { ButtonProps } from "@/Components/Button/button.types";
import { Tooltip } from "@/Components/Tooltip";

/**
 * Internal icon-only toolbar control. Not part of the public API.
 */
export function DataTableToolbarButton({
  icon,
  size,
  label,
  onClick,
  buttonProps,
}: {
  buttonProps?: Partial<
    Omit<Extract<ButtonProps, { as?: "button" }>, "icon" | "onClick">
  >;
  icon: IconSource;
  label: string;
  onClick?: () => void;
  size?: ButtonProps["size"];
}) {
  return (
    <Tooltip
      content={label}
      slots={{
        trigger: (
          <Button
            size={size}
            icon={icon}
            color="dark"
            type="button"
            density="mini"
            onClick={onClick}
            aria-label={label}
            {...buttonProps}
          />
        ),
      }}
    />
  );
}
