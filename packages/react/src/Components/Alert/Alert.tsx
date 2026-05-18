// ** Local Imports
import type { AlertProps } from "@/Components/Alert/alert.types";
import { useAlert } from "@/Components/Alert/hooks/useAlert";
import { Icon } from "@/Components/Icon";

function Alert(props: AlertProps) {
  const { children, slots, ...rest } = props;

  const {
    merged,
    showIcon,
    bodyClasses,
    iconClasses,
    rootClasses,
    resolvedIcon,
    showTitleRow,
    titleClasses,
    hasDefaultBody,
  } = useAlert(
    rest,
    {
      shadow: "sm",
      rounded: "sm",
      variant: "flat",
      color: "primary",
      padding: "medium",
    },
    { children, slots },
  );

  return (
    <div className={rootClasses}>
      {slots?.header}

      {!slots?.header && showTitleRow && (
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-x-3">
            {showIcon &&
              (slots?.icon != null
                ? slots.icon
                : resolvedIcon && (
                    <Icon icon={resolvedIcon} className={iconClasses} />
                  ))}
            <div className={titleClasses}>{merged.title}</div>
          </div>
          {slots?.action}
        </div>
      )}

      {hasDefaultBody && <div className={bodyClasses}>{children}</div>}

      {slots?.footer}
    </div>
  );
}

export default Alert;
