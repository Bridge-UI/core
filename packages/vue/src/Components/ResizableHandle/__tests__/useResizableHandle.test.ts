// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import {
  useResizableHandle,
  type ResizableHandleOwnProps,
} from "@/Components/ResizableHandle";

const libDefaults = {
  disabled: false,
  hideGrip: false,
} as const;

function mountUseResizableHandle(props: ResizableHandleOwnProps = {}) {
  let result!: ReturnType<typeof useResizableHandle>;

  const Host = defineComponent({
    setup() {
      result = useResizableHandle(props, libDefaults);

      return () => h("div");
    },
  });

  mount(
    defineComponent({
      setup() {
        return () => h(Resizable, null, () => [h(Host)]);
      },
    }),
  );

  return { result };
}

test("it should bind a focusable separator", () => {
  const { result } = mountUseResizableHandle();

  expect(result.showGrip.value).toBe(true);
  expect(result.disabled.value).toBe(false);
  expect(result.rootBind.value.tabindex).toBe(0);
  expect(result.rootBind.value.role).toBe("separator");
  expect(result.rootBind.value["aria-orientation"]).toBe("vertical");
});

test("it should hide the grip with hideGrip", () => {
  const { result } = mountUseResizableHandle({ hideGrip: true });

  expect(result.showGrip.value).toBe(false);
});

test("it should leave the tab order when disabled", () => {
  const { result } = mountUseResizableHandle({ disabled: true });

  expect(result.disabled.value).toBe(true);
  expect(result.rootBind.value.tabindex).toBe(-1);
  expect(result.rootBind.value["data-disabled"]).toBe("");
});
