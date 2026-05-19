// ** Local Imports
import type { AlertProps } from "@/Components/Alert";
import { useAlert } from "@/Components/Alert";
import { Icon } from "@/Components/Icon";
import { isNull } from "es-toolkit/compat";

function Alert(props: AlertProps) {
  const {
    slots,
    merged,
    bodyBind,
    children,
    iconBind,
    showIcon,
    titleBind,
    rootClasses,
    resolvedIcon,
    showTitleRow,
    rootHtmlProps,
    hasDefaultBody,
  } = useAlert(props, {
    shadow: "sm",
    rounded: "sm",
    variant: "flat",
    color: "primary",
    padding: "medium",
  });

  return (
    <div {...rootHtmlProps} className={rootClasses}>
      {slots?.header}

      {!slots?.header && showTitleRow && (
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-x-3">
            {showIcon &&
              (!isNull(slots?.icon)
                ? slots.icon
                : resolvedIcon && <Icon icon={resolvedIcon} {...iconBind} />)}

            <div {...titleBind}>{merged.title}</div>
          </div>

          {slots?.action}
        </div>
      )}

      {hasDefaultBody && <div {...bodyBind}>{children}</div>}

      {slots?.footer}
    </div>
  );
}

export default Alert;
