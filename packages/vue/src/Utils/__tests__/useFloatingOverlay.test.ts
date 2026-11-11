// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import {
  useFloatingOverlay,
  type FloatingOverlayConfig,
  type UseFloatingOverlayOptions,
} from "@/Utils/useFloatingOverlay";

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function mountOverlay(
  config: FloatingOverlayConfig = {},
  options: Partial<UseFloatingOverlayOptions> = {},
) {
  const show = ref(false);
  const setShow = vi.fn((next: boolean) => {
    show.value = next;
  });

  let result!: ReturnType<typeof useFloatingOverlay>;

  const Wrapper = defineComponent({
    setup() {
      result = useFloatingOverlay({
        show,
        config,
        setShow,
        id: "overlay",
        ...options,
      });

      return () => h("div");
    },
  });

  const wrapper = mount(Wrapper, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  return { show, result, setShow, wrapper };
}

test("it should mount when shown and unmount when hidden", async () => {
  const { show, result } = mountOverlay();

  expect(result.mounted.value).toBe(false);

  show.value = true;
  await flushPromises();
  expect(result.mounted.value).toBe(true);

  show.value = false;
  await flushPromises();
  expect(result.mounted.value).toBe(false);
});

test("it should stay mounted and hidden with keepMounted", async () => {
  const { show, result } = mountOverlay({ keepMounted: true });

  show.value = true;
  await flushPromises();
  show.value = false;
  await flushPromises();

  expect(result.mounted.value).toBe(true);
  expect(result.isHiddenWhileMounted.value).toBe(true);
});

test("it should toggle and request close through setShow", async () => {
  const { result, setShow } = mountOverlay();

  result.toggle();
  expect(setShow).toHaveBeenLastCalledWith(true);
  await flushPromises();

  result.requestClose();
  expect(setShow).toHaveBeenLastCalledWith(false);
});

test("it should ignore close requests when persistent", async () => {
  const { show, result, setShow } = mountOverlay({ persistent: true });

  show.value = true;
  await flushPromises();

  result.toggle();
  result.requestClose();

  expect(setShow).not.toHaveBeenCalled();
});

test("it should call onOpen each time it opens", async () => {
  const onOpen = vi.fn();
  const { show } = mountOverlay({}, { onOpen });

  show.value = true;
  await flushPromises();
  show.value = false;
  await flushPromises();
  show.value = true;
  await flushPromises();

  expect(onOpen).toHaveBeenCalledTimes(2);
});

test("it should claim and release the open slot", async () => {
  const release = vi.fn();
  const claimOpen = vi.fn(() => release);
  const { show } = mountOverlay({}, { claimOpen });

  show.value = true;
  await flushPromises();

  expect(claimOpen).toHaveBeenCalledWith(
    expect.objectContaining({ id: "overlay" }),
  );

  show.value = false;
  await flushPromises();

  expect(release).toHaveBeenCalledOnce();
});

test("it should close on Escape unless closeOnEscape is false", async () => {
  const open = mountOverlay();

  open.show.value = true;
  await flushPromises();
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(open.setShow).toHaveBeenCalledWith(false);

  const blocked = mountOverlay({ closeOnEscape: false });

  blocked.show.value = true;
  await flushPromises();
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(blocked.setShow).not.toHaveBeenCalled();
});

test("it should lock body scroll unless disableScrollLock is set", async () => {
  const locked = mountOverlay();

  locked.show.value = true;
  await flushPromises();
  expect(document.body.style.overflow).toBe("hidden");

  locked.show.value = false;
  await flushPromises();

  const free = mountOverlay({ disableScrollLock: true });

  free.show.value = true;
  await flushPromises();
  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should drop deferred open work when unmounted before it runs", async () => {
  const claimOpen = vi.fn(() => vi.fn());
  const onOpen = vi.fn();
  const { show, wrapper } = mountOverlay({}, { onOpen, claimOpen });
  const addSpy = vi.spyOn(document, "addEventListener");

  show.value = true;
  await nextTick();
  wrapper.unmount();
  mountedWrappers.pop();
  await flushPromises();

  const pointerListeners = addSpy.mock.calls.filter(
    ([type]) => type === "pointerdown",
  );

  addSpy.mockRestore();

  expect(pointerListeners).toHaveLength(0);
  expect(claimOpen).not.toHaveBeenCalled();
  expect(onOpen).not.toHaveBeenCalled();
});

test("it should run open work once per open", async () => {
  const onOpen = vi.fn();
  const claimOpen = vi.fn(() => vi.fn());
  const { show } = mountOverlay({}, { onOpen, claimOpen });

  show.value = true;
  await flushPromises();

  expect(onOpen).toHaveBeenCalledOnce();
  expect(claimOpen).toHaveBeenCalledOnce();
});
