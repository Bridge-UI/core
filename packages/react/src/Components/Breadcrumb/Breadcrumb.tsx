// ** Local Imports
import type { BreadcrumbProps } from "@/Components/Breadcrumb/breadcrumb.types";
import { BreadcrumbContext } from "@/Components/Breadcrumb/BreadcrumbContext";
import { useBreadcrumb } from "@/Components/Breadcrumb/hooks/useBreadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

const breadcrumbLibDefaults = {
  size: "md",
  separator: "chevronRight",
} as const;

function Breadcrumb(props: BreadcrumbProps) {
  const { children, rootBind, listBind, contextValue, collapsedItems } =
    useBreadcrumb(props, breadcrumbLibDefaults);

  const hasChildren = children != null && children !== false;
  const useItems = !hasChildren && collapsedItems.length > 0;

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav {...rootBind}>
        <ol {...listBind}>
          {useItems
            ? collapsedItems.map((entry, index) => {
                if (entry.type === "ellipsis") {
                  return (
                    <BreadcrumbItem as="span" key={`ellipsis-${index}`}>
                      …
                    </BreadcrumbItem>
                  );
                }

                const { item } = entry;

                return (
                  <BreadcrumbItem
                    as={item.as}
                    href={item.href}
                    key={entry.index}
                    current={item.current}
                    endIcon={item.endIcon}
                    disabled={item.disabled}
                    iconOnly={item.iconOnly}
                    startIcon={item.startIcon}
                  >
                    {item.label}
                  </BreadcrumbItem>
                );
              })
            : null}

          {hasChildren ? children : null}
        </ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

export default Breadcrumb;
