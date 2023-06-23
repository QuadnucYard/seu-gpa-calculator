<template>
  <q-popup-proxy context-menu :breakpoint="400" ref="popupRef" class="popup">
    <data-filter
      :data="data"
      :name="name"
      :field="field"
      :label="label"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @reset="handleReset"
    />
  </q-popup-proxy>
</template>

<script setup lang="ts" generic="T, TKey extends keyof T, TField extends keyof T">
import { QPopupProxy } from "quasar";

type TVal = T[TKey];

const props = defineProps<{ data: T[]; label?: string; name: TKey; field?: TField }>();

const popupRef = ref<QPopupProxy>();

const emit = defineEmits<{
  set: [TVal[]];
  reset: [];
}>();

const handleConfirm = (selected: TVal[]) => {
  popupRef.value?.hide();
  emit("set", selected);
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
