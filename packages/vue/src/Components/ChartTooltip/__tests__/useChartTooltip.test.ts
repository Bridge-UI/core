// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import {
  useChartTooltip,
  type ChartTooltipOwnProps,
} from "@/Components/ChartTooltip";

async function mountUseChartTooltip(props: ChartTooltipOwnProps = {}) {
  let result!: ReturnType<typeof useChartTooltip>;

  const Probe = defineComponent({
    setup() {
      result = useChartTooltip(props, ref(null));

      return () => h("div");
    },
  });

  const wrapper = mount(ChartLine, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "Revenue", data: [1500, 2] }),
        h(Probe),
      ],
    },
  });

  await flushPromises();

  return { result, wrapper };
}

const item = { id: "a", value: 1500, color: "red", name: "Revenue" };

test("it should be closed without an active index", async () => {
  const { result } = await mountUseChartTooltip();

  expect(result.isOpen.value).toBe(false);
  expect(result.context.value).toBeNull();
});

test("it should format values with the chart locale", async () => {
  const { result } = await mountUseChartTooltip();

  expect(result.formatValue(item)).toBe("1,500");
});

test("it should prefer formatValue from props", async () => {
  const { result } = await mountUseChartTooltip({
    formatValue: (value) => `${value} USD`,
  });

  expect(result.formatValue({ ...item, value: 2 })).toBe("2 USD");
});

test("it should open when the plot reports an active index", async () => {
  const { result, wrapper } = await mountUseChartTooltip();

  await wrapper.find("[role='img']").trigger("keydown", { key: "ArrowRight" });
  await flushPromises();

  expect(result.isOpen.value).toBe(true);
  expect(result.context.value?.title).toBe("Jan");
  expect(result.rootBind.value["aria-hidden"]).toBe(true);
});
