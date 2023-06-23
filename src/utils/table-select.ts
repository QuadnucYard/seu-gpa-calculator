import { QTable } from "quasar";
import { Ref } from "vue";

let storedSelectedRow: any;

export class SelectionHandler<T> {
  private readonly tableRef: Ref<QTable | undefined>;
  private readonly selected: Ref<T[]>;

  constructor(tableRef: Ref<QTable | undefined>, selected: Ref<T[]>) {
    this.tableRef = tableRef;
    this.selected = selected;
  }

  public handle({ rows, added, evt }: { rows: readonly any[]; added: boolean; evt: Event }) {
    // ignore selection change from header of not from a direct click event
    if (rows.length !== 1 || evt === void 0) {
      return;
    }

    const oldSelectedRow = storedSelectedRow;
    const [newSelectedRow] = rows;
    const { ctrlKey, shiftKey } = evt;

    if (shiftKey !== true) {
      storedSelectedRow = newSelectedRow;
    }

    // wait for the default selection to be performed
    nextTick(() => {
      if (shiftKey === true) {
        const tableRows = this.tableRef.value!.filteredSortedRows;
        let firstIndex = tableRows.indexOf(oldSelectedRow);
        let lastIndex = tableRows.indexOf(newSelectedRow);

        if (firstIndex < 0) {
          firstIndex = 0;
        }

        if (firstIndex > lastIndex) {
          [firstIndex, lastIndex] = [lastIndex, firstIndex];
        }

        const rangeRows = tableRows.slice(firstIndex, lastIndex + 1);
        // we need the original row object so we can match them against the rows in range
        const selectedRows = this.selected.value.map(toRaw);

        this.selected.value =
          added === true
            ? selectedRows.concat(rangeRows.filter(row => selectedRows.includes(row) === false))
            : selectedRows.filter(row => rangeRows.includes(row) === false);
      } else if (ctrlKey !== true && added === true) {
        this.selected.value = [newSelectedRow];
      }
    });
  }
}
