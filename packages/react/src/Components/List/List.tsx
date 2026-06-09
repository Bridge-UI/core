// ** External Imports
import { createElement } from "react";

// ** Local Imports
import { ListContext } from "@/Components/List/ListContext";
import { useList } from "@/Components/List/hooks/useList";
import type { ListProps } from "@/Components/List/list.types";

function List(props: ListProps) {
  const { merged, children, rootBind, contextValue } = useList(props, {
    padding: "normal",
  });

  return (
    <ListContext.Provider value={contextValue}>
      {createElement(merged.as ?? "ul", rootBind, children)}
    </ListContext.Provider>
  );
}

export default List;
