// ** Local Imports
import type { AvatarProps } from "@/Components/Avatar";
import { useAvatar } from "@/Components/Avatar";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

function Avatar(props: AvatarProps) {
  const {
    slots,
    merged,
    children,
    rootBind,
    iconBind,
    hasImage,
    imageBind,
    fallbackBind,
    resolvedIcon,
    hasFallbackText,
    hasCustomContent,
  } = useAvatar(props, {
    size: "md",
    rounded: "full",
    color: "secondary",
  });

  const hasFallbackSlot = hasNamedSlot(slots, "fallback");

  return (
    <div {...rootBind}>
      {hasCustomContent && children}

      {!hasCustomContent && hasImage && <img {...imageBind} />}

      {!hasCustomContent && !hasImage && hasFallbackSlot && slots?.fallback}

      {!hasCustomContent &&
        !hasImage &&
        !hasFallbackSlot &&
        hasFallbackText && <span {...fallbackBind}>{merged.fallback}</span>}

      {!hasCustomContent &&
        !hasImage &&
        !hasFallbackSlot &&
        !hasFallbackText && <Icon icon={resolvedIcon} {...iconBind} />}
    </div>
  );
}

export default Avatar;
