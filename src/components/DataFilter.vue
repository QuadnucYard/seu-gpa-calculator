<template>
  <div class="container column shadow-2">
    <q-btn
      flat
      icon="filter_alt_off"
      size="sm"
      align="left"
      :label="filterOffLabel"
      class="q-my-xs overflow-hidden"
      @click="$emit('reset')"
    />
    <q-input outlined v-model="searchText" placeholder="搜索" dense class="my-text-xs" />
    <div class="border-box q-my-xs col-8">
      <q-checkbox
        dense
        size="xs"
        label="(全选)"
        class="my-text-xs"
        v-model="selectAll"
        @update:model-value="handleSelectAll"
      />
      <q-option-group
        type="checkbox"
        dense
        size="xs"
        class="my-text-xs"
        :options="options"
        v-model="selection"
        @update:model-value="handleSelect"
      />
    </div>

    <div class="col flex">
      <q-space />
      <q-btn dense size="sm" label="确定" class="bottom-button" @click="$emit('confirm')" />
      <q-btn dense size="sm" label="取消" class="bottom-button" @click="$emit('cancel')" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T, TKey extends keyof T">
import _ from "lodash-es";

type TVal = T[TKey];

const props = defineProps<{ data: T[]; optKey: TKey; optLabel?: string }>();

const selection = ref<TVal[]>([]) as Ref<TVal[]>;
const selectAll = ref<boolean | null>(false);

const searchText = ref("");

const filterOffLabel = computed(() => `从"${ props.optLabel ?? unref(props.optKey).toString()}"中清除筛选`);

const options = computed(() =>
  _.uniqBy(props.data, props.optKey).map(t => ({
    value: t[props.optKey],
    label: String(t[props.optKey]),
  }))
);
console.log(options.value);

// 这里有个问题  不能随便v-model
// 需要注意，确认一次选择后会更新 filteredRows，从而导致更新 props，

const handleSelectAll = () => {
  // selection.value 是 value 的数组
  if (selectAll.value === true) {
    selection.value = _.map(options.value, "value");
  } else if (selectAll.value === false) {
    selection.value = [];
  }
};

const handleSelect = () => {
  if (selection.value.length == 0) selectAll.value = false;
  else if (selection.value.length == options.value.length) selectAll.value = true;
  else selectAll.value = null;
};

defineEmits<{
  confirm: [TVal[]];
  cancel: [];
  reset: [];
}>();
</script>

<style scoped lang="scss">
.container {
  width: 240px;
  height: 300px;
  background-color: white;
  padding: 8px;

  :deep(.q-field--dense .q-field__control) {
    height: 24px;
  }

  .my-text-xs {
    font-size: 12px;
  }

  .bottom-button {
    width: 40px;
    height: 24px;
    margin: 0 4px;
  }
}

.border-box {
  border: solid 1px;
  border-color: grey;
  border-radius: 4px;
  padding: 4px;
  overflow-x: hidden;
}

.overflow-hidden {
  overflow: hidden;
}
</style>
