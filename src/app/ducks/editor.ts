import { hen, Hen } from "app/util/createReducer";
import { downloadFile } from "app/util";
import { createSelector } from "reselect";
import * as DB from "app/models/pg";
import { RootState } from "app/reducers";
import { tableToSql } from "app/lib/sqlizer/psql";

type TableMap = { [k: string]: DB.Table };
enum AlertStatus {
  Success = "success",
  Error = "error",
}
interface Alert {
  message: string;
  status: AlertStatus;
}

export interface InitialState {
  tables: TableMap;
  alerts: Array<Alert>;
}

const initialState: InitialState = {
  alerts: [],
  tables: {
    user: {
      columns: [
        { name: "user_id", type: "uuid", nonNull: true, primary: 1 },
        { name: "addr_id", type: "int8", nonNull: true },
      ],
      name: "user",
      references: [
        {
          name: "addr_id_fk",
          columns: ["addr_id"],
          tableRef: "address",
          columnsRef: ["addr_id"],
          deferrable: false,
          deferred: false,
        },
      ],
    },
    address: {
      columns: [
        { name: "addr_id", type: "serial8", nonNull: true, primary: 1 },
      ],
      name: "address",
    },
  },
};

// Selectors
const mainSelector = (state: RootState) => state.editor;

export const tableSelector = createSelector(mainSelector, (editor) => ({
  tables: editor.tables,
  tableList: Object.keys(editor.tables).map((k) => editor.tables[k]),
}));

export const getTables = createSelector(tableSelector, (ts) => ({
  tables: ts.tableList,
}));

export const getAvailableTables = createSelector(tableSelector, (ts) => ({
  tables: ts.tableList,
  availableTables: ts.tableList.map((t) => t.name),
  availableTableColumns: ts.tableList.reduce(
    (map, t) => ((map[t.name] = t.columns.map((c) => c.name)), map),
    {}
  ),
}));

class EditorReactions extends Hen<InitialState> {
  pushAlert(a: Alert) {
    this.state.alerts.push();
  }
  removeTable(tName: string) {
    delete this.state.tables[tName];
  }
  updateTable(tName: string, t: DB.Table) {
    this.state.tables[tName] = t;
  }
}

export const [menuReducer, actions] = hen(new EditorReactions(initialState));
export default menuReducer;

export function updateTable(t: DB.Table) {
  return (dispatch, getState) => {
    const state = getState();
    const { tables } = mainSelector(state);
    if (!!tables[t.name]) {
      dispatch(actions.pushAlert({ status: AlertStatus.Success, message: "" }));
    }

    dispatch(actions.updateTable(t.name, t));
  };
}

export function exportSQL() {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const { tables } = getTables(state);

    downloadFile("export.sql", "application/sql", [
      tables.map((t) => tableToSql(t)).join("\r\n"),
    ]);
  };
}
