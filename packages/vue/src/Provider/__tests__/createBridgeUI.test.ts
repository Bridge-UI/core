// ** External Imports
import { expect, test } from "vitest";
import { createApp, defineComponent, h, inject } from "vue";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";
import { createBridgeUI } from "@/Provider/createBridgeUI";
import { BRIDGE_UI_INJECTION_KEY } from "@/Provider/injectionKey";

function mountWithPlugin(
  options: Parameters<typeof createBridgeUI>[0] = {},
): undefined | BridgeUIContextApi {
  let injected: undefined | BridgeUIContextApi;

  const App = defineComponent({
    setup() {
      injected = inject(BRIDGE_UI_INJECTION_KEY) ?? undefined;

      return () => h("div");
    },
  });

  const app = createApp(App);

  app.use(createBridgeUI(options));
  app.mount(document.createElement("div"));

  return injected;
}

test("it should install as a Vue plugin and provide the injection key", () => {
  const api = mountWithPlugin();

  expect(api).toBeDefined();
});

test("it should provide default global config when no options given", () => {
  const api = mountWithPlugin();

  expect(api?.global.value.theme).toBe("light");
  expect(api?.global.value.locale).toBe("en-US");
  expect(api?.global.value.direction).toBe("ltr");
});

test("it should pass user options to the provider", () => {
  const api = mountWithPlugin({ global: { theme: "dark" } });

  expect(api?.global.value.theme).toBe("dark");
  expect(api?.global.value.locale).toBe("en-US");
});
