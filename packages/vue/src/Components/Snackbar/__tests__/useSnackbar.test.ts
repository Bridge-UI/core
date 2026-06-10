// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { useSnackbar, type SnackbarOwnProps } from "@/Components/Snackbar";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const libDefaults: Partial<SnackbarOwnProps> = {
  duration: 5000,
  color: "primary",
  padding: "medium",
  closeButton: true,
  progressbar: true,
  teleportTo: "body",
  transition: "slide",
  position: "bottom-center",
};

function mountUseSnackbar(
  props: Partial<SnackbarOwnProps> = {},
  show = ref(true),
) {
  let result!: ReturnType<typeof useSnackbar>;

  const Wrapper = defineComponent({
    setup() {
      result = useSnackbar(
        props,
        libDefaults as Parameters<typeof useSnackbar>[1],
        {
          show,
        },
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { show, result };
}

test("it should return default color as primary", () => {
  const { result } = mountUseSnackbar({ duration: false, transition: "none" });

  expect(result.merged.value.color).toBe("primary");
});

test("it should include bottom-center position class on portal bind", () => {
  const { result } = mountUseSnackbar({ duration: false, transition: "none" });

  expect(result.portalBind.value.class).toContain("items-end");
  expect(result.portalBind.value.class).toContain("justify-center");
});

test("it should include top-center position class when position is top-center", () => {
  const { result } = mountUseSnackbar({
    duration: false,
    transition: "none",
    position: "top-center",
  });

  expect(result.portalBind.value.class).toContain("items-start");
});

test("it should set show to false when requestClose is invoked", () => {
  const show = ref(true);

  const { result } = mountUseSnackbar(
    { duration: false, transition: "none" },
    show,
  );

  result.requestClose();

  expect(show.value).toBe(false);
});

test("it should apply fade transition classes on panel when transition is slide", () => {
  const { result } = mountUseSnackbar({ duration: false, transition: "slide" });

  expect(result.panelBind.value["data-state"]).toBeDefined();
  expect(result.panelBind.value.class).toContain(
    "data-[state=open]:translate-y-0",
  );
});

test("it should include motion-reduce fallback on slide transition", () => {
  const { result } = mountUseSnackbar({ duration: false, transition: "slide" });

  expect(result.panelBind.value.class).toContain(
    "motion-reduce:transition-none",
  );
});

test("it should resolve default icon from color", () => {
  const { result } = mountUseSnackbar({
    duration: false,
    color: "success",
    transition: "none",
  });

  expect(result.resolvedIcon.value).toBeTruthy();
});

test("it should close on escape keydown", () => {
  const show = ref(true);

  mountUseSnackbar({ duration: false, transition: "none" }, show);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(show.value).toBe(false);
});
