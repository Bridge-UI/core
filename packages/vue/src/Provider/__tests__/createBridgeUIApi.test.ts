// ** External Imports
import { expect, test } from "vitest";
import { computed, effectScope } from "vue";

// ** Core Imports
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@bridge-ui/core";

// ** Local Imports
import { createBridgeUIApi } from "@/Provider/createBridgeUIApi";

function createDefaultOptionsRef() {
  return computed(() => ({
    global: {},
    components: {},
  }));
}

test("it should return global defaults when no parent and no options", () => {
  const scope = effectScope();

  scope.run(() => {
    const api = createBridgeUIApi(undefined, createDefaultOptionsRef());

    expect(api.global.value).toEqual(BRIDGE_UI_DEFAULT_GLOBAL);
    expect(api.components.value).toEqual({});
  });

  scope.stop();
});

test("it should merge options into global defaults", () => {
  const scope = effectScope();

  scope.run(() => {
    const optionsRef = computed(() => ({
      global: { theme: "dark" },
      components: {},
    }));

    const api = createBridgeUIApi(undefined, optionsRef);

    expect(api.global.value.theme).toBe("dark");
    expect(api.global.value.locale).toBe("en-US");
  });

  scope.stop();
});

test("it should merge component config from options", () => {
  const scope = effectScope();

  scope.run(() => {
    const optionsRef = computed(() => ({
      global: {},
      components: { Alert: { defaultProps: { color: "error" as const } } },
    }));

    const api = createBridgeUIApi(undefined, optionsRef);

    expect(api.components.value.Alert?.defaultProps?.color).toBe("error");
  });

  scope.stop();
});

test("it should inherit from parent and merge child options", () => {
  const scope = effectScope();

  scope.run(() => {
    const parentApi = createBridgeUIApi(undefined, createDefaultOptionsRef());
    parentApi.setGlobal({ theme: "dark" });

    const childOptions = computed(() => ({
      global: { locale: "pt-BR" },
      components: {},
    }));

    const childApi = createBridgeUIApi(parentApi, childOptions);

    expect(childApi.global.value.theme).toBe("dark");
    expect(childApi.global.value.locale).toBe("pt-BR");
  });

  scope.stop();
});

test("it should update global via setGlobal", () => {
  const scope = effectScope();

  scope.run(() => {
    const api = createBridgeUIApi(undefined, createDefaultOptionsRef());

    expect(api.global.value.theme).toBe("light");

    api.setGlobal({ theme: "dark" });

    expect(api.global.value.theme).toBe("dark");
    expect(api.global.value.locale).toBe("en-US");
  });

  scope.stop();
});

test("it should update components via setComponents", () => {
  const scope = effectScope();

  scope.run(() => {
    const api = createBridgeUIApi(undefined, createDefaultOptionsRef());

    api.setComponents({
      Alert: { defaultProps: { color: "success" } },
    });

    expect(api.components.value.Alert?.defaultProps?.color).toBe("success");
  });

  scope.stop();
});
