// ** External Imports
import { createElement } from "react";

// ** Local Imports
import { useListSection } from "@/Components/ListSection/hooks/useListSection";
import type { ListSectionProps } from "@/Components/ListSection/listSection.types";

function ListSection(props: ListSectionProps) {
  const { label, merged, rootBind, titleBind } = useListSection(props);

  if (merged.as === "div") {
    return <div {...titleBind}>{label}</div>;
  }

  return createElement(
    merged.as ?? "li",
    rootBind,
    <div {...titleBind}>{label}</div>,
  );
}

export default ListSection;
