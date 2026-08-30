// ** Local Imports
import type { EmptyStateProps } from "@/Components/EmptyState/emptyState.types";
import { useEmptyState } from "@/Components/EmptyState/hooks/useEmptyState";
import { Icon } from "@/Components/Icon";
import { derived, hasNamedSlot, hasSlotOrProp } from "@/Utils";

function EmptyState(props: EmptyStateProps) {
  const {
    slots,
    merged,
    iconBind,
    rootBind,
    titleBind,
    mediaBind,
    actionsBind,
    descriptionBind,
  } = useEmptyState(props, {
    size: "md",
    titleAs: "p",
    align: "center",
    mediaDecorative: true,
  });

  const TitleTag = merged.titleAs;

  const hasMedia = derived(() => {
    return hasNamedSlot(slots, "media") || Boolean(merged.icon);
  });

  return (
    <div {...rootBind}>
      {hasMedia ? (
        <div {...mediaBind}>
          {hasNamedSlot(slots, "media") ? (
            slots?.media
          ) : merged.icon != null ? (
            <Icon icon={merged.icon} {...iconBind} />
          ) : null}
        </div>
      ) : null}

      {hasSlotOrProp(slots, "title", merged.title) ? (
        <TitleTag {...titleBind}>
          {hasNamedSlot(slots, "title") ? slots?.title : merged.title}
        </TitleTag>
      ) : null}

      {hasSlotOrProp(slots, "description", merged.description) ? (
        <div {...descriptionBind}>
          {hasNamedSlot(slots, "description")
            ? slots?.description
            : merged.description}
        </div>
      ) : null}

      {hasNamedSlot(slots, "action") ? (
        <div {...actionsBind}>{slots?.action}</div>
      ) : null}
    </div>
  );
}

export default EmptyState;
