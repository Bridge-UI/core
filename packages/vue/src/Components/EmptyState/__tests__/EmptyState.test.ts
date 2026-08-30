// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { EmptyState } from "@/Components/EmptyState";

test("it should render the root element", () => {
  const wrapper = mount(EmptyState, { props: { title: "Empty" } });

  expect(wrapper.find(".max-w-md").exists()).toBe(true);
});

test("it should render a title when title prop is provided", () => {
  const wrapper = mount(EmptyState, { props: { title: "No projects yet" } });

  expect(wrapper.text()).toContain("No projects yet");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mount(EmptyState, {
    props: {
      title: "No projects yet",
      description: "Create your first project to get started.",
    },
  });

  expect(wrapper.text()).toContain("Create your first project to get started.");
});

test("it should render the default icon when icon is provided", () => {
  const wrapper = mount(EmptyState, {
    props: { icon: "search", title: "No results" },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should hide decorative media from assistive tech", () => {
  const wrapper = mount(EmptyState, {
    props: {
      icon: "search",
      title: "No results",
      customProps: { media: { id: "empty-media" } },
    },
  });

  expect(wrapper.find("#empty-media").attributes("aria-hidden")).toBe("true");
});

test("it should not hide media when mediaDecorative is false", () => {
  const wrapper = mount(EmptyState, {
    props: {
      icon: "search",
      title: "No results",
      mediaDecorative: false,
      customProps: { media: { id: "empty-media" } },
    },
  });

  expect(wrapper.find("#empty-media").attributes("aria-hidden")).toBe(
    undefined,
  );
});

test("it should render title as the requested heading", () => {
  const wrapper = mount(EmptyState, {
    props: { titleAs: "h2", title: "No projects yet" },
  });

  expect(wrapper.find("h2").text()).toBe("No projects yet");
});

test("it should apply compact size classes when size is sm", () => {
  const wrapper = mount(EmptyState, {
    props: { size: "sm", title: "No results" },
  });

  expect(wrapper.find(".max-w-sm").exists()).toBe(true);
});

test("it should apply start alignment classes when align is start", () => {
  const wrapper = mount(EmptyState, {
    props: { align: "start", title: "No results" },
  });

  expect(wrapper.find(".items-start").exists()).toBe(true);
});

test("it should apply end alignment classes when align is end", () => {
  const wrapper = mount(EmptyState, {
    props: { align: "end", title: "No results" },
  });

  expect(wrapper.find(".ms-auto").exists()).toBe(true);
});

test("it should render multiple buttons in the action slot", () => {
  const wrapper = mount(EmptyState, {
    props: { title: "No projects yet" },
    slots: {
      action:
        "<button type='button'>New project</button><button type='button'>Learn more</button>",
    },
  });

  expect(wrapper.text()).toContain("Learn more");
  expect(wrapper.text()).toContain("New project");
});

test("it should render title and description slots instead of props", () => {
  const wrapper = mount(EmptyState, {
    props: {
      title: "Prop title",
      description: "Prop description",
    },
    slots: {
      title: "Slot title",
      description: "Slot description",
    },
  });

  expect(wrapper.text()).toContain("Slot title");
  expect(wrapper.text()).toContain("Slot description");
  expect(wrapper.text()).not.toContain("Prop title");
  expect(wrapper.text()).not.toContain("Prop description");
});

test("it should render media slot instead of the icon prop", () => {
  const wrapper = mount(EmptyState, {
    slots: { media: "<span>Custom media</span>" },
    props: { icon: "search", title: "No results" },
  });

  expect(wrapper.find("svg").exists()).toBe(false);
  expect(wrapper.text()).toContain("Custom media");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(EmptyState, {
    props: { title: "Custom class", class: "custom-empty" },
  });

  expect(wrapper.find(".max-w-md").classes()).toContain("custom-empty");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(EmptyState, {
    props: {
      title: "With id",
      id: "empty-root",
      "data-testid": "empty",
    },
  });

  const root = wrapper.find("#empty-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("empty");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(EmptyState, {
    props: { title: "With attrs" },
    attrs: {
      id: "empty-from-attrs",
      "data-testid": "empty-attrs",
    },
  });

  const root = wrapper.find("#empty-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("empty-attrs");
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(EmptyState, {
    props: {
      class: "py-4",
      title: "Priority",
      classes: { root: "py-10" },
    },
  });

  const root = wrapper.find(".max-w-md");

  expect(root.classes()).toContain("py-4");
  expect(root.classes()).not.toContain("py-10");
});

test("it should forward customProps to title and description containers", () => {
  const wrapper = mount(EmptyState, {
    props: {
      title: "Title",
      description: "Body",
      customProps: {
        title: { id: "empty-title" },
        description: { id: "empty-description" },
      },
    },
  });

  expect(wrapper.find("#empty-title").exists()).toBe(true);
  expect(wrapper.find("#empty-description").exists()).toBe(true);
});
