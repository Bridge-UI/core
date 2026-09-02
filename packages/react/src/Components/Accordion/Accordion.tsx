// ** Local Imports
import type { AccordionProps } from "@/Components/Accordion/accordion.types";
import { AccordionContext } from "@/Components/Accordion/AccordionContext";
import { useAccordion } from "@/Components/Accordion/hooks/useAccordion";

const accordionLibDefaults = {
  size: "md",
  color: "dark",
  multiple: false,
  disabled: false,
  variant: "default",
} as const;

function Accordion(props: AccordionProps) {
  const { children, rootBind, contextValue } = useAccordion(
    props,
    accordionLibDefaults,
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div {...rootBind}>{children}</div>
    </AccordionContext.Provider>
  );
}

export default Accordion;
