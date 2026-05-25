// ** External Imports
import { useCallback, useState } from "react";

type UsePasswordVisibilityOptions = {
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
};

export function usePasswordField(options: UsePasswordVisibilityOptions) {
  const { visible, onVisibilityChange } = options;

  const [internalVisible, setInternalVisible] = useState(false);

  const isVisible = visible ?? internalVisible;

  const toggleVisibility = useCallback(() => {
    const next = !isVisible;

    if (visible === undefined) {
      setInternalVisible(next);
    }

    onVisibilityChange?.(next);
  }, [visible, isVisible, onVisibilityChange]);

  return {
    isVisible,
    toggleVisibility,
  };
}
