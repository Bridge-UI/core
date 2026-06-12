// ** External Imports
import { mount } from "@vue/test-utils";
import { User } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useAvatar, type AvatarProps } from "@/Components/Avatar";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "secondary",
} satisfies Partial<AvatarProps>;

function mountUseAvatar(props: Partial<AvatarProps> = {}) {
  let result!: ReturnType<typeof useAvatar>;

  const Wrapper = defineComponent({
    setup() {
      result = useAvatar(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default size, rounded and color", () => {
  const { merged } = mountUseAvatar();

  expect(merged.value.size).toBe("md");
  expect(merged.value.rounded).toBe("full");
  expect(merged.value.color).toBe("secondary");
});

test("it should override size when prop is passed", () => {
  const { merged } = mountUseAvatar({ size: "lg" });

  expect(merged.value.size).toBe("lg");
});

test("it should detect image when src is passed", () => {
  const { hasImage, imageBind } = mountUseAvatar({
    src: "https://example.com/avatar.jpg",
  });

  expect(hasImage.value).toBe(true);
  expect(imageBind.value.src).toBe("https://example.com/avatar.jpg");
});

test("it should detect fallback text when fallback is passed", () => {
  const { hasFallbackText } = mountUseAvatar({ fallback: "JP" });

  expect(hasFallbackText.value).toBe(true);
});

test("it should default resolved icon to User", () => {
  const { resolvedIcon } = mountUseAvatar();

  expect(resolvedIcon.value).toBe(User);
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseAvatar();

  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should apply size classes on root for icon fallback", () => {
  const { rootBind } = mountUseAvatar();

  expect(rootBind.value.class).toContain("w-10");
  expect(rootBind.value.class).toContain("h-10");
});

test("it should apply size classes on image when src is passed", () => {
  const { rootBind, imageBind } = mountUseAvatar({
    src: "https://example.com/avatar.jpg",
  });

  expect(rootBind.value.class).toContain("w-10");
  expect(rootBind.value.class).toContain("h-10");
  expect(imageBind.value.class).toContain("w-10");
  expect(imageBind.value.class).toContain("h-10");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseAvatar({ class: "custom-avatar" });

  expect(rootBind.value.class).toContain("custom-avatar");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseAvatar({
    id: "avatar-root",
    "data-testid": "avatar",
  });

  expect(rootBind.value.id).toBe("avatar-root");
  expect(rootBind.value["data-testid"]).toBe("avatar");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseAvatar({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});
