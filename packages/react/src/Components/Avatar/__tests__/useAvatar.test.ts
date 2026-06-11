// ** External Imports
import { renderHook } from "@testing-library/react";
import { User } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useAvatar,
  type AvatarOwnProps,
  type AvatarProps,
} from "@/Components/Avatar";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "secondary",
} as const satisfies Partial<AvatarOwnProps>;

function renderUseAvatar(props: AvatarProps = {}) {
  return renderHook(() =>
    useAvatar(props, libDefaults as Parameters<typeof useAvatar>[1]),
  );
}

test("it should merge default size, rounded and color", () => {
  const { result } = renderUseAvatar();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.rounded).toBe("full");
  expect(result.current.merged.color).toBe("secondary");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseAvatar({ size: "lg" });

  expect(result.current.merged.size).toBe("lg");
});

test("it should detect image when src is passed", () => {
  const { result } = renderUseAvatar({ src: "https://example.com/avatar.jpg" });

  expect(result.current.hasImage).toBe(true);
  expect(result.current.imageBind.src).toBe("https://example.com/avatar.jpg");
});

test("it should detect fallback text when fallback is passed", () => {
  const { result } = renderUseAvatar({ fallback: "JP" });

  expect(result.current.hasFallbackText).toBe(true);
});

test("it should default resolved icon to User", () => {
  const { result } = renderUseAvatar();

  expect(result.current.resolvedIcon).toStrictEqual(User);
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseAvatar();

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should apply size classes on root for icon fallback", () => {
  const { result } = renderUseAvatar();

  expect(result.current.rootBind.className).toContain("w-10");
  expect(result.current.rootBind.className).toContain("h-10");
});

test("it should apply size classes on image when src is passed", () => {
  const { result } = renderUseAvatar({ src: "https://example.com/avatar.jpg" });

  expect(result.current.imageBind.className).toContain("w-10");
  expect(result.current.imageBind.className).toContain("h-10");
  expect(result.current.rootBind.className).not.toContain("w-10");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseAvatar({ className: "custom-avatar" });

  expect(result.current.rootBind.className).toContain("custom-avatar");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseAvatar({
    id: "avatar-root",
    "data-testid": "avatar",
  });

  expect(result.current.rootBind.id).toBe("avatar-root");
  expect(result.current.rootBind["data-testid"]).toBe("avatar");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseAvatar({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});
