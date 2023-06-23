<template>
  <q-popup-proxy context-menu :breakpoint="400" ref="popupRef" class="popup">
    <data-filter
      :data="data"
      :opt-key="optKey"
      :opt-label="optLabel"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @reset="handleReset"
    />
  </q-popup-proxy>
</template>

<script setup lang="ts" generic="T, TKey extends keyof T">
import { QPopupProxy } from "quasar";

type TVal = T[TKey];

const props = defineProps<{ data: T[]; optKey: TKey; optLabel?: string }>();

const popupRef = ref<QPopupProxy>();

const emit = defineEmits<{
  confirm: [TVal[]];
  reset: [];
}>();

const handleConfirm = (selected: TVal[]) => {
  popupRef.value?.hide();
  emit("confirm", selected);
};
const handleCancel = () => {
  popupRef.value?.hide();
};
const handleReset = () => {
  popupRef.value?.hide();
  emit("reset");
};
</script>

<style scoped lang="scss">
.popup {
  overflow: hidden;
}
</style>
