// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Calendar } from "@/Components/Calendar";

test("it should render year and month selectors", () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(true);
  expect(wrapper.find('[aria-label="Select month"]').exists()).toBe(true);
});

test("it should open the month panel", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select month"]').trigger("click");

  expect(
    wrapper.findAll("button").some((node) => /january/i.test(node.text())),
  ).toBe(true);
});

test("it should open the year panel", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select year"]').trigger("click");

  expect(wrapper.findAll("button").some((node) => node.text() === "2021")).toBe(
    true,
  );
});

test("it should emit change when a day is selected", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should hide year selector when hideYears is set", () => {
  const wrapper = mount(Calendar, {
    props: { hideYears: true, viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(false);
});

test("it should update the date grid after year and month selection", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select year"]').trigger("click");

  const year = wrapper.findAll("button").find((node) => node.text() === "2018");

  await year?.trigger("click");

  const month = wrapper
    .findAll("button")
    .find((node) => /march/i.test(node.text()));

  await month?.trigger("click");

  expect(wrapper.find('[aria-label="Select year"]').text()).toContain("2018");
  expect(
    wrapper.find('[aria-label="Select month"]').text().toLowerCase(),
  ).toContain("march");

  const fifteenth = wrapper
    .findAll("button")
    .find(
      (node) =>
        node.text() === "15" && !node.classes().includes("text-dark-400"),
    );

  await fifteenth?.trigger("click");

  const selected = wrapper.emitted("change")?.[0]?.[0] as Date;

  expect(selected.getFullYear()).toBe(2018);
  expect(selected.getMonth()).toBe(2);
  expect(selected.getDate()).toBe(15);
});

test("it should navigate months when viewDate is passed without viewDateChange", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Next month"]').trigger("click");

  expect(
    wrapper.find('[aria-label="Select month"]').text().toLowerCase(),
  ).toContain("june");
});

test("it should paginate years with nav arrows on the year panel", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select year"]').trigger("click");

  const yearButtons = () => wrapper.find('[role="grid"]').findAll("button");

  expect(yearButtons().some((node) => node.text() === "2021")).toBe(true);

  await wrapper.find('[aria-label="Next years"]').trigger("click");

  expect(yearButtons().some((node) => node.text() === "2021")).toBe(false);
  expect(yearButtons().some((node) => node.text() === "2036")).toBe(true);
});

test("it should change year with nav arrows on the month panel", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select month"]').trigger("click");
  await wrapper.find('[aria-label="Next year"]').trigger("click");

  expect(
    wrapper.find('[aria-label="Select month"]').text().toLowerCase(),
  ).toContain("may");
  expect(wrapper.find('[aria-label="Select year"]').text()).toContain("2022");
});

test("it should keep the today button on year and month panels", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.find('[aria-label="Today"]').exists()).toBe(true);

  await wrapper.find('[aria-label="Select year"]').trigger("click");
  expect(wrapper.find('[aria-label="Today"]').exists()).toBe(true);

  await wrapper.find('[aria-label="Select month"]').trigger("click");
  expect(wrapper.find('[aria-label="Today"]').exists()).toBe(true);
});

test("it should return to today's month without selecting a date", async () => {
  const today = new Date();

  const wrapper = mount(Calendar, {
    props: {
      value: new Date(2021, 4, 21),
      viewDate: new Date(2021, 4, 1),
    },
  });

  await wrapper.find('[aria-label="Select year"]').trigger("click");
  await wrapper.find('[aria-label="Today"]').trigger("click");

  expect(wrapper.find('[aria-label="Select year"]').text()).toContain(
    String(today.getFullYear()),
  );
  expect(wrapper.find('[role="grid"]').exists()).toBe(true);

  const todayCell = wrapper
    .findAll("button")
    .find(
      (node) =>
        node.text() === String(today.getDate()) &&
        node.attributes("aria-current") === "date",
    );

  expect(todayCell).toBeTruthy();
  expect(wrapper.emitted("change")).toBeUndefined();
});

test("it should open on the month panel and commit a month-start date", async () => {
  const wrapper = mount(Calendar, {
    props: { granularity: "month", viewDate: new Date(2021, 4, 1) },
  });

  expect(
    wrapper.findAll("button").some((node) => /january/i.test(node.text())),
  ).toBe(true);
  expect(wrapper.findAll("button").some((node) => node.text() === "21")).toBe(
    false,
  );

  const march = wrapper
    .findAll("button")
    .find((node) => /march/i.test(node.text()));

  await march?.trigger("click");

  const selected = wrapper.emitted("change")?.[0]?.[0] as Date;

  expect(selected.getFullYear()).toBe(2021);
  expect(selected.getMonth()).toBe(2);
  expect(selected.getDate()).toBe(1);
});

test("it should open on the year panel and commit January 1", async () => {
  const wrapper = mount(Calendar, {
    props: { granularity: "year", viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.findAll("button").some((node) => node.text() === "2021")).toBe(
    true,
  );

  const year = wrapper.findAll("button").find((node) => node.text() === "2018");

  await year?.trigger("click");

  const selected = wrapper.emitted("change")?.[0]?.[0] as Date;

  expect(selected.getFullYear()).toBe(2018);
  expect(selected.getMonth()).toBe(0);
  expect(selected.getDate()).toBe(1);
});

test("it should not mark the focused month selected when the value is empty", () => {
  const wrapper = mount(Calendar, {
    props: { granularity: "month", viewDate: new Date(2021, 4, 1) },
  });

  const may = wrapper
    .findAll("button")
    .find(
      (node) =>
        !node.attributes("aria-label")?.startsWith("Select") &&
        /may/i.test(node.text()),
    );

  expect(may?.attributes("aria-pressed")).toBe("false");
});

test("it should not mark the focused year selected when the value is empty", () => {
  const wrapper = mount(Calendar, {
    props: { granularity: "year", viewDate: new Date(2021, 4, 1) },
  });

  const year = wrapper
    .findAll("button")
    .find(
      (node) =>
        !node.attributes("aria-label")?.startsWith("Select") &&
        node.text() === "2021",
    );

  expect(year?.attributes("aria-pressed")).toBe("false");
});
