// ** Local Imports
import type { AccordionItemProps } from "@/Components/AccordionItem/accordionItem.types";
import { useAccordionItem } from "@/Components/AccordionItem/hooks/useAccordionItem";
import { Icon } from "@/Components/Icon";

function AccordionItem(props: AccordionItemProps) {
  const {
    slots,
    children,
    rootBind,
    titleBind,
    panelBind,
    triggerBind,
    titleContent,
    collapseBind,
    indicatorBind,
    panelInnerBind,
    hasIndicatorSlot,
  } = useAccordionItem(props);

  return (
    <div {...rootBind}>
      <button {...triggerBind}>
        <span {...titleBind}>{titleContent}</span>

        {hasIndicatorSlot ? (
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
