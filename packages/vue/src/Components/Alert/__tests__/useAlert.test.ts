// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useAlert,
  type AlertOwnProps,
  type AlertProps,
} from "@/Components/Alert";

const libDefaults: Partial<AlertOwnProps> = {
  color: "primary",
  variant: "flat",
  shadow: "none",
  rounded: "none",
  padding: "none",
};

function mountUseAlert(props: AlertProps = {}) {
  let result!: ReturnType<typeof useAlert>;

  const Wrapper = defineComponent({
    setup() {
      result = useAlert(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default color as primary", () => {
  const { merged } = mountUseAlert();

  expect(merged.value.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseAlert({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should resolve the default icon for a given color", () => {
  const { resolvedIcon } = mountUseAlert({ color: "error" });

  expect(resolvedIcon.value).not.toBeNull();
});

test("it should suppress the icon when icon is null", () => {
  const { resolvedIcon } = mountUseAlert({ icon: null });

  expect(resolvedIcon.value).toBeNull();
});

test("it should compute rootClasses as a non-empty string", () => {
  const { rootClasses } = mountUseAlert({
    variant: "flat",
    color: "primary",
  });

  expect(typeof rootClasses.value).toBe("string");
  expect(rootClasses.value.length).toBeGreaterThan(0);
});

test("it should include shadow classes when shadow is set", () => {
  const { rootClasses } = mountUseAlert({ shadow: "sm" });

  expect(rootClasses.value).toContain("shadow");
});

test("it should include rounded classes when rounded is set", () => {
  const { rootClasses } = mountUseAlert({ rounded: "md" });

  expect(rootClasses.value).toContain("rounded");
});

test("it should compute title classes with font-normal when no body", () => {
  const { titleClasses } = mountUseAlert({ title: "Test" });

  expect(titleClasses.value).toContain("font-normal");
});

test("it should show title row when title prop is provided", () => {
  const { showTitleRow } = mountUseAlert({ title: "Hello" });

  expect(showTitleRow.value).toBe(true);
});

test("it should hide title row when no title, icon, or icon slot", () => {
  const { showTitleRow } = mountUseAlert({ icon: null });

  expect(showTitleRow.value).toBe(false);
});

test("it should merge class into rootClasses", () => {
  const { rootClasses } = mountUseAlert({ class: "custom-alert" });

  expect(rootClasses.value).toContain("custom-alert");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseAlert({
    id: "alert-root",
    "data-testid": "alert",
  });

  expect(rootBind.value.id).toBe("alert-root");
  expect(rootBind.value["data-testid"]).toBe("alert");
});

test("it should apply class after classes.root in rootClasses", () => {
  const { rootClasses } = mountUseAlert({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootClasses.value).toContain("p-4");
  expect(rootClasses.value).not.toContain("p-2");
});
