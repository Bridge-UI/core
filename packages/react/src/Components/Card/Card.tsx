// ** Local Imports
import type { CardProps } from "@/Components/Card";
import { useCard } from "@/Components/Card";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

function Card(props: CardProps) {
  const {
    slots,
    merged,
    bodyBind,
    children,
    rootBind,
    hasFooter,
    titleBind,
    footerBind,
    headerBind,
    hasDefaultBody,
  } = useCard(props, {
    shadow: "sm",
    rounded: "sm",
    padding: "medium",
    variant: "elevated",
  });

  return (
    <div {...rootBind}>
      {slots?.header}

      {!slots?.header && hasSlotOrProp(slots, "title", merged.title) && (
        <div {...headerBind}>
          <div {...titleBind}>
            {resolveSlotOrProp({
              slots,
              name: "title",
              fallback: merged.title,
            })}
          </div>

          {slots?.action}
        </div>
      )}

      {hasDefaultBody && <div {...bodyBind}>{children}</div>}

      {hasFooter && <div {...footerBind}>{slots?.footer}</div>}
    </div>
  );
}

export default Card;
