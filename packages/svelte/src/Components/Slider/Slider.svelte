<script lang="ts">
  // ** External Imports
  import { untrack } from "svelte";

  // ** Core Imports
  import {
    resolveSliderBounds,
    resolveSliderDefaultValue,
    type SliderRangeValue,
  } from "@bridge-ui/core/Domain";

  // ** Local Imports
  import { BaseField } from "@/Components/BaseField";
  import { useSlider } from "@/Components/Slider/hooks/useSlider.svelte";
  import type { SliderProps } from "@/Components/Slider/slider.types";
  import { Tooltip } from "@/Components/Tooltip";

  let {
    end,
    start,
    thumb,
    value = $bindable(),
    ...props
  }: SliderProps = $props();

  const id = $props.id();

  const sliderLibDefaults = {
    min: 0,
    step: 1,
    max: 100,
    size: "md",
    rounded: "full",
    color: "primary",
    showStops: false,
    showTooltip: true,
  } as const;

  // Uncontrolled fallback, seeded once from `defaultValue`.
  let uncontrolledValue = $state<number | SliderRangeValue>(
    untrack(() => {
      const bounds = resolveSliderBounds({
        min: props.min ?? sliderLibDefaults.min,
        max: props.max ?? sliderLibDefaults.max,
        step: props.step ?? sliderLibDefaults.step,
      });

      return resolveSliderDefaultValue({
        ...bounds,
        range: Boolean(props.range),
        defaultValue: props.defaultValue,
      });
    }),
  );

  let thumbEls = $state<[null | HTMLButtonElement, null | HTMLButtonElement]>([
    null,
    null,
  ]);

  const api = useSlider(
    () => props,
    sliderLibDefaults,
    {
      get current() {
        return value ?? uncontrolledValue;
      },
      set current(next) {
        if (value === undefined) {
          uncontrolledValue = next;
        } else {
          value = next;
        }
      },
    },
    {
      autoId: id,
      onChange: (next) => {
        props.onChange?.(next);
      },
    },
  );
</script>

<BaseField field={api.baseField} {start} {end}>
  <div {...api.controlBind}>
    <div {...api.trackBind} {@attach api.attachTrack}>
      <div {...api.barBind}></div>

      {#each api.resolvedStops as stop (stop.value)}
        <div {...api.getStopBind(stop)}></div>
      {/each}

      {#each api.thumbIndexes as thumbIndex (thumbIndex)}
        <button
          {...api.getThumbBind(thumbIndex)}
          bind:this={thumbEls[thumbIndex]}
        >
          {#if thumb}
            {@render thumb()}
          {:else}
            <span {...api.getThumbKnobBind(thumbIndex)}></span>
          {/if}
        </button>
      {/each}
    </div>

    {#if api.showTooltip}
      {#each api.thumbIndexes as thumbIndex (thumbIndex)}
        <Tooltip
          arrow
          size="sm"
          openDelay={0}
          placement="top"
          closeDelay={0}
          anchorEl={thumbEls[thumbIndex]}
          show={api.isTooltipOpen(thumbIndex)}
          content={String(api.readThumbValue(thumbIndex))}
          {...api.tooltipProps}
        />
      {/each}
    {/if}

    {#if api.hasStopLabels}
      <div {...api.stopLabelsBind}>
        {#each api.resolvedStops as stop (stop.value)}
          {#if stop.label}
            <div {...api.getStopLabelBind(stop)}>{stop.label}</div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</BaseField>
