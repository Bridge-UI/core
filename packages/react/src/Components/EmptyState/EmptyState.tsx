// ** Local Imports
import type { EmptyStateProps } from "@/Components/EmptyState/emptyState.types";
import { useEmptyState } from "@/Components/EmptyState/hooks/useEmptyState";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

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
  const hasMedia = hasNamedSlot(slots, "media") || Boolean(merged.icon);
  const hasActions =
    hasNamedSlot(slots, "action") || hasNamedSlot(slots, "secondaryAction");

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

      {hasActions ? (
        <div {...actionsBind}>
          {slots?.action}
          {slots?.secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
