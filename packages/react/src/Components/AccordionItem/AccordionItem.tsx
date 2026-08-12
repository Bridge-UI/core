// ** Local Imports
import type { AccordionItemProps } from "@/Components/AccordionItem/accordionItem.types";
import { useAccordionItem } from "@/Components/AccordionItem/hooks/useAccordionItem";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

function AccordionItem(props: AccordionItemProps) {
  const {
    slots,
    merged,
    children,
    rootBind,
    titleBind,
    panelBind,
    triggerBind,
    collapseBind,
    indicatorBind,
    panelInnerBind,
  } = useAccordionItem(props);

  return (
    <div {...rootBind}>
      <button {...triggerBind}>
        <span {...titleBind}>
          {hasNamedSlot(slots, "title") ? slots?.title : merged.title}
        </span>

        {hasNamedSlot(slots, "indicator") ? (
          slots?.indicator
        ) : (
          <Icon icon="chevronDown" {...indicatorBind} />
        )}
      </button>

      <div {...collapseBind}>
        <div {...panelInnerBind}>
          <div {...panelBind}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AccordionItem;
