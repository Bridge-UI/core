// ** Local Imports
import type { CardProps } from "@/Components/Card";
import { useCard } from "@/Components/Card";
import { Text } from "@/Components/Text";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

function Card(props: CardProps) {
  const {
    slots,
    merged,
    bodyBind,
    children,
    rootBind,
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
          <Text as="div" color="inherit" {...titleBind}>
            {hasNamedSlot(slots, "title") ? slots?.title : merged.title}
          </Text>

          {slots?.action}
        </div>
      )}

      {hasDefaultBody && (
        <Text as="div" color="inherit" {...bodyBind}>
          {children}
        </Text>
      )}

      {hasNamedSlot(slots, "footer") && (
        <div {...footerBind}>{slots?.footer}</div>
      )}
    </div>
  );
}

export default Card;
