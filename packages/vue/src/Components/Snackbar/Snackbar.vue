<script setup lang="ts">
// ** External Imports
import { X } from "lucide-vue-next";
import { computed, useSlots } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useSnackbar } from "@/Components/Snackbar/composables/useSnackbar";
import type {
  SnackbarEmits,
  SnackbarOwnProps,
  SnackbarSlots,
} from "@/Components/Snackbar/snackbar.types";

defineSlots<SnackbarSlots>();

const slots = useSlots();

const emit = defineEmits<SnackbarEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SnackbarOwnProps>(), {
  closeButton: true,
  progressbar: true,
  teleportTo: "body",
});

const model = defineModel<boolean>({ default: false });

const {
  merged,
  rendered,
  rootBind,
  iconBind,
  titleBind,
  progressBind,
  resolvedIcon,
  descriptionBind,
  requestClose,
} = useSnackbar(
  props,
  {
    color: "primary",
    duration: 5000,
    transition: "slide",
    closeButton: true,
    progressbar: true,
    teleportTo: "body",
  },
  {
    show: model,
    stackId: props.stackId,
    onClose: () => emit("close"),
    onShowChange: (show) => props.onShowChange?.(show),
  },
);

const hasIcon = computed(() => {
  return Boolean(slots.icon || resolvedIcon.value || merged.value.img);
});

const hasTitle = computed(() => {
  return Boolean(slots.title || merged.value.title);
});

const hasDescription = computed(() => {
  return Boolean(slots.description || merged.value.description);
});

const hasRight = computed(() => {
  return Boolean(slots.right);
});

const teleportDisabled = computed(() => merged.value.teleportTo === false);

const teleportTarget = computed(() => {
  if (merged.value.teleportTo === false) {
    return "body";
  }

  return merged.value.teleportTo;
});
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div
      v-if="rendered"
      v-bind="rootBind"
      :class="cn(rootBind.class, { flex: hasRight })"
    >
      <div
        v-if="
          model && merged.duration !== false && merged.progressbar !== false
        "
        v-bind="progressBind"
      />

      <div
        :class="{
          'pl-4': merged.dense,
          'p-4': !hasRight,
          'w-0 flex-1 flex items-center p-4': hasRight,
        }"
      >
        <div
          :class="{
            'flex items-start': !hasRight,
            'w-full flex': hasRight,
          }"
        >
          <div
            v-if="hasIcon"
            class="shrink-0"
            :class="{
              'w-6': Boolean(resolvedIcon || slots.icon),
              'pt-0.5': Boolean(merged.img),
            }"
          >
            <slot name="icon" />

            <img
              v-if="!slots.icon && merged.img"
              :src="merged.img"
              alt=""
              class="w-10 h-10 rounded-full"
            />

            <Icon
              v-if="!slots.icon && !merged.img && resolvedIcon"
              :icon="resolvedIcon"
              v-bind="iconBind"
            />
          </div>

          <div class="w-0 flex-1 pt-0.5" :class="{ 'ml-3': hasIcon }">
            <p v-if="hasTitle" v-bind="titleBind">
              <slot name="title">{{ merged.title }}</slot>
            </p>

            <p v-if="hasDescription" v-bind="descriptionBind">
              <slot name="description">{{ merged.description }}</slot>
            </p>

            <slot />

            <div
              v-if="slots.actions"
              class="flex mt-3 gap-x-3"
              :class="merged.classes?.actions"
            >
              <slot name="actions" />
            </div>
          </div>

          <div class="flex ml-4 shrink-0">
            <slot name="trailing" />

            <button
              v-if="merged.closeButton !== false"
              type="button"
              aria-label="Close"
              class="cursor-pointer inline-flex rounded-md text-dark-400 hover:text-dark-500 focus:outline-hidden"
              @click="requestClose"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <slot name="right" />
    </div>
  </Teleport>
</template>
