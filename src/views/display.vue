<template>
  <div style="height:100vh;">
    <div class="q-pa-md">
      <q-table
        title="成绩查询"
        dense
        :rows="tableRows"
        :columns="tableColumns"
        row-key="WID"
        selection="multiple"
        :pagination="{rowsPerPage: 1000}"
        :loading="loading"
        v-model:selected="selected"
        :visible-columns="visibleColumns"
        table-style="height: 80vh;"
        class="sticky-table"
      >
        <template v-slot:top>
          <div class="q-table__title">成绩查询</div>
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
        <template v-slot:bottom>
          <q-chip square :clickable="false">
            <q-avatar color="red" text-color="white" style="width: 60px">总学分</q-avatar>
            {{ gpa.sumCredit }}
          </q-chip>
          <q-chip square :clickable="false">
            <q-avatar color="red" text-color="white" style="width: 60px">平均分</q-avatar>
            {{ gpa.avgScore }}
          </q-chip>
          <q-chip square :clickable="false">
            <q-avatar color="red" text-color="white" style="width: 70px">GPA(4.8)</q-avatar>
            {{ gpa.GPA48 }} × {{ gpa.sumGP48 }} ＝ {{ round4(gpa.GPA48 * gpa.sumGP48) }}
          </q-chip>
          <q-chip square :clickable="false">
            <q-avatar color="red" text-color="white" style="width: 70px">GPA(4.0)</q-avatar>
            {{ gpa.GPA40 }} × {{ gpa.sumGP40 }} ＝ {{ round4(gpa.GPA40 * gpa.sumGP40) }}
          </q-chip>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { query } from "@/api/query";
import { calcGPA } from "@/utils/gpa";
import { calcGP48, calcGP40, round3,round4  } from "@/utils/gpa";

const loading = ref(true);
const tableRows = ref<any[]>([]);
const tableColumns = ref<any>([]);
const selected = ref<any[]>([]);

console.log("init load");

const visibleColumns = ref<string[]>([]);
const exclusion = ["TSYYDM", "JDF", "SFPJ"];

const pagination = ref({
  sortBy: "XNXQDM",
  descending: false,
  page: 1,
  rowsPerPage: 100,
  // rowsNumber: xx if getting data from a server
});

const init = async () => {
  console.log("mounted");
  const { model, data } = await query();
  console.log(model, data);
  tableRows.value = data.map((r: any) => {
    const gp48 = calcGP48(r.ZCJ);
    const gp40 = calcGP40(r.ZCJ);
    return Object.assign(r, {
      XFJD48: gp48,
      JDF48: round3(gp48 * r.XF),
      XFJD40: gp40,
      JDF40: gp40 * r.XF,
    });
  });
  tableColumns.value = model
    .filter(
      (t: any) =>
        !t["form.hidden"] &&
        t.caption &&
        t.caption.length < 7 &&
        !t.name.startsWith("BY") &&
        !exclusion.includes(t.name)
    )
    .concat([
      { name: "XFJD48", caption: "(4.8)", required: true },
      { name: "JDF48", caption: "(4.8)", required: true },
      { name: "XFJD40", caption: "(4.0)", required: true },
      { name: "JDF40", caption: "(4.0)", required: true },
    ])
    .map((t: any) => ({
      name: t.name,
      label: t.caption,
      field: t.name.endsWith("DM") ? t.name + "_DISPLAY" : t.name,
      align: "center",
      sortable: true,
      required: t.required ?? false,
    }));
  visibleColumns.value = model
    .filter((t: any) => !t.hidden && t.caption != "替代课程" && t.caption != "替代课程号")
    .map((t: any) => t.name);
  console.log(tableRows.value, tableColumns.value, visibleColumns.value);
  selected.value = tableRows.value.filter(
    t => t.CXCKDM_DISPLAY == "首修" && (t.KCXZDM_DISPLAY == "必修" || t.KCXZDM_DISPLAY == "限选")
  );
  loading.value = false;
};
onMounted(init);

const gpa = computed(() => calcGPA(selected.value));
</script>

<style scoped lang="scss">
.sticky-table {
  max-height: 600px;

  tr th {
    position: sticky;
    /* higher than z-index for td below */
    z-index: 2;
    /* bg color is important; just specify one */
    background: #fff;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
    /* highest z-index */
    z-index: 3;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:first-child th:first-child
    /* highest z-index */ {
    z-index: 3;
  }

  td:first-child {
    z-index: 1;
  }

  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }
}
</style>
