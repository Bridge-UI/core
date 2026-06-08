import { isNil } from "es-toolkit/compat";
import { useCallback, useMemo, useState } from "react";

export type UsePasswordFieldOptions = {
  onVisibilityChange?: (visible: boolean) => void;
  visible?: boolean | null;
};

export function usePasswordField(options: UsePasswordFieldOptions = {}) {
  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = !isNil(options.visible);

  const isVisible = useMemo(() => {
    if (isControlled) {
      return Boolean(options.visible);
    }

    return internalVisible;
  }, [isControlled, internalVisible, options.visible]);

  const toggleVisibility = useCallback(() => {
    const next = !isVisible;

    if (!isControlled) {
      setInternalVisible(next);
    }

    options.onVisibilityChange?.(next);
  }, [isControlled, isVisible, options]);

  return {
    isVisible,
    toggleVisibility,
  };
}
