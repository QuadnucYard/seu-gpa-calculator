<template>
  <div style="height: 100vh">
    <div class="q-pa-md">
      <q-table
        title="成绩查询"
        dense
        :rows="tableRows"
        :columns="tableColumns"
        row-key="WID"
        selection="multiple"
        :pagination="{ rowsPerPage: 1000 }"
        :loading="loading"
        v-model:selected="selected"
        :visible-columns="visibleColumns"
        table-style="height: 100%;"
        class="sticky-table full-height"
        ref="tableRef"
        :filter="filters"
        :filter-method="filterFn"
        @selection="selectionHandler.handle($event)"
      >
        <template #top>
          <div>
            <div class="q-table__title">
              成绩查询
              <q-btn round icon="logout" size="sm" title="注销" @click="handleLogout" />
            </div>
            <div v-if="user">欢迎 {{ user.userName }}({{ user.userDepartment }})</div>
          </div>
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
        <template #header-cell="props">
          <q-th :props="props">
            <span :style="props.col.name in filters ? 'color: blue' : ''">{{
              props.col.label
            }}</span>
            <data-filter-popup
              :data="tableRef?.filteredSortedRows"
              :name="props.col.name"
              :field="props.col.field"
              :label="props.col.label"
              @set="onFilterSet(props.col.name, $event)"
              @reset="onFilterReset(props.col.name)"
            />
          </q-th>
        </template>
        <template #body-cell-KCXZDM="props">
          <q-td :props="props">
            <q-badge
              :color="['blue-grey', 'primary', 'secondary', 'info'][Number(props.row.KCXZDM)]"
              :label="props.value"
            />
          </q-td>
        </template>
        <template #body-cell-XFJD48="props">
          <q-td :props="props">
            <q-badge :color="props.row.JD_color48" :label="props.value" />
          </q-td>
        </template>
        <template #body-cell-JDF48="props">
          <q-td :props="props">
            <q-badge :color="props.row.JD_color48" :label="props.value" />
          </q-td>
        </template>
        <template #body-cell-XFJD40="props">
          <q-td :props="props">
            <q-badge :color="props.row.JD_color40" :label="props.value" />
          </q-td>
        </template>
        <template #body-cell-JDF40="props">
          <q-td :props="props">
            <q-badge :color="props.row.JD_color40" :label="props.value" />
          </q-td>
        </template>
        <template #bottom>
          <div>
            <q-chip square :clickable="false">
              <q-avatar color="amber" text-color="white" style="width: 60px">已选课程</q-avatar>
              {{ gpa.total }}
            </q-chip>
            <q-chip square :clickable="false">
              <q-avatar color="red" text-color="white" style="width: 60px">总学分</q-avatar>
              {{ gpa.sumCredit.toFixed(2) }}
            </q-chip>
            <q-chip square :clickable="false">
              <q-avatar color="pink" text-color="white" style="width: 60px">平均分</q-avatar>
              {{ gpa.avgScore.toFixed(2) }}
            </q-chip>
            <q-chip square :clickable="false">
              <q-avatar color="orange" text-color="white" style="width: 70px">GPA(4.8)</q-avatar>
              {{ gpa.GPA48.toFixed(4) }}
            </q-chip>
            <q-chip square :clickable="false">
              <q-avatar color="deep-orange" text-color="white" style="width: 70px">
                GPA(4.0)
              </q-avatar>
              {{ gpa.GPA40.toFixed(4) }}
            </q-chip>
          </div>
          <div>
            <div class="text-grey">Tip: 可手动选择参与计算的课程！右键表头打开筛选</div>
            <div class="text-grey">
              Use <kbd>SHIFT</kbd> to select / deselect a range and <kbd>CTRL</kbd> to add to
              selection
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUser, logout } from "@/api/login";
import { calcGPA } from "@/utils/gpa";
import { formatTableDisplay } from "@/utils/table-display";
import { SelectionHandler } from "@/utils/table-select";
import { QTable } from "quasar";
import _ from "lodash-es";

const $router = useRouter();
const $q = useQuasar();

const tableRef = ref<QTable>();

const loading = ref(true);
const user = ref<any>(undefined);
const tableRows = ref<any[]>([]);
const tableColumns = ref<any>([]);
const selected = ref<any[]>([]);

const visibleColumns = ref<string[]>([]);

const filters = reactive<{ [key: string]: any[] }>({});

onMounted(async () => {
  user.value = await getUser();
  if (!user.value) {
    $q.notify({ type: "warning", message: "当前未登录！" });
    $router.push({ name: "login" });
    return;
  }

  const table = await formatTableDisplay();
  tableRows.value = table.rows;
  tableColumns.value = table.cols;
  visibleColumns.value = table.visibleCols;
  selected.value = table.selected;

  loading.value = false;
});

const gpa = computed(() => calcGPA(selected.value));

const handleLogout = async () => {
  $q.notify({ type: "info", message: "退出登录状态" });
  await logout();
  $router.push({ name: "index" });
};

const selectionHandler = new SelectionHandler(tableRef, selected);

const onFilterSet = (key: string, selection: any[]) => {
  // if (selection.length < _.find(tableColumns.value, t => t.name === key).length)
  filters[key] = selection;
};
const onFilterReset = (key: string) => {
  delete filters[key];
};
watch(filters, () => {
  selected.value = selected.value.filter(t => tableRef.value?.filteredSortedRows.includes(t));
});

const filterFn = (
  rows: readonly any[],
  terms: { [key: string]: any[] },
  cols: readonly any[],
  getCellValue: (col: any, row: any) => any
) => {
  // 参数就是传给table的行列和filter
  return rows.filter(r => cols.every(c => terms[c.name]?.includes(r[c.name]) ?? true));
  // 检验这行值的每一项如果在terms里那么就得在约束里
};
</script>

<style scoped lang="scss">
.full-height {
  max-height: calc(100vh - 40px);
}

.sticky-table {
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
  // tr:first-child th:first-child {
  //   /* highest z-index */
  //   z-index: 3;
  // }

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
