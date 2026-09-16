/**
 * Registry of mounted action hosts. Overlay content (modal / drawer / dialog)
 * is rendered as a sibling of inner hosts, so provide/inject and React context
 * do not reach it. {@link ActionHostRegistry.resolve} falls back to the last
 * registered host when the call site is outside the host tree.
 */
export type ActionHostRegistry<T> = {
  /**
   * Registers `api` and returns an unregister function.
   */
  register: (api: T) => () => void;

  /**
   * Prefer `injected` (nearest host). Otherwise the last registered host.
   */
  resolve: (injected: T | null | undefined) => T | undefined;
};

const resetters = new Set<() => void>();

/**
 * Creates a last-registered-wins host registry for one action type.
 */
export function createActionHostRegistry<T>(): ActionHostRegistry<T> {
  const hosts: T[] = [];

  resetters.add(() => {
    hosts.length = 0;
  });

  return {
    resolve(injected) {
      if (injected) {
        return injected;
      }

      return hosts[hosts.length - 1];
    },
    register(api) {
      hosts.push(api);

      return () => {
        const index = hosts.lastIndexOf(api);

        if (index !== -1) {
          hosts.splice(index, 1);
        }
      };
    },
  };
}

/**
 * Clears every action-host registry. For tests only.
 */
export function resetActionHostRegistriesForTests() {
  resetters.forEach((reset) => {
    reset();
  });
}
