// ** Local Imports
import type { AlertProps } from "@/Components/Alert";
import { useAlert } from "@/Components/Alert";
import { Icon } from "@/Components/Icon";

function Alert(props: AlertProps) {
  const {
    slots,
    merged,
    children,
    showIcon,
    bodyClasses,
    iconClasses,
    rootClasses,
    resolvedIcon,
    showTitleRow,
    titleClasses,
    hasDefaultBody,
  } = useAlert(props, {
    shadow: "sm",
    rounded: "sm",
    variant: "flat",
    color: "primary",
    padding: "medium",
  });

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
