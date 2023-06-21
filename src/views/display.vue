<template>
  <div>
    <div class="q-pa-md">
      <q-table
        title="成绩查询"
        dense
        :rows="tableRows"
        :columns="tableColumns"
        row-key="WID"
        selection="multiple"
        :pagination="{ rowsPerPage: 100 }"
        :loading="loading"
        v-model:selected="selected"
        :visible-columns="visibleColumns"
        table-style="height: 80vh;"
      >
        <template v-slot:top>
          <q-space />
          <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="tableColumns"
            option-value="name"
            options-cover
            style="min-width: 150px"
          />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { query } from "@/api/query";

const loading = ref(true);
const tableRows = ref([]);
const tableColumns = ref<any>([]);
const selected = ref([]);

console.log("init load");

const visibleColumns = ref<string[]>([]);
const exclusion = ["TSYYDM", "JDF", "SFPJ"];

const init = async () => {
  console.log("mounted");
  const {
    model,
    data: { rows },
  } = await query();
  console.log(model, rows);
  tableRows.value = rows;
  tableColumns.value = model.controls
    .filter(
      (t: any) =>
        !t["form.hidden"] &&
        t.caption &&
        t.caption.length < 7 &&
        !t.name.startsWith("BY") &&
        !exclusion.includes(t.name)
    )
    .map((t: any) => ({
      name: t.name,
      label: t.caption,
      field: t.name.endsWith("DM") ? t.name + "_DISPLAY" : t.name,
      align: "center",
      sortable: true,
    }));
  visibleColumns.value = model.controls
    .filter((t: any) => !t.hidden && t.caption != "替代课程")
    .map((t: any) => t.name);
  console.log(tableColumns.value, visibleColumns.value);
  selected.value = tableRows.value;
  loading.value = false;
};
onMounted(init);
</script>

<style scoped lang="scss">
.q-table {
  max-height: 600px;
  thead tr th {
    position: sticky;
  }
}
</style>
