import { hen, Hen } from "app/util/createReducer";
import { createSelector } from "reselect";
import * as DB from "app/models/pg";
import { RootState } from "app/reducers";

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
          defferrable: false,
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

export const tableSelector = createSelector(
  mainSelector,
  (editor) => ({
    tables: editor.tables,
    tableList: Object.keys(editor.tables).map((k) => editor.tables[k]),
  })
);

export const getTables = createSelector(
  tableSelector,
  (ts) => ({
    tables: ts.tableList,
  })
);

export const getAvailableTables = createSelector(
  tableSelector,
  (ts) => ({
    tables: ts.tableList,
    availableTables: ts.tableList.map((t) => t.name),
    availableTableColumns: ts.tableList.reduce(
      (map, t) => ((map[t.name] = t.columns.map((c) => c.name)), map),
      {}
    ),
  })
);

class EditorReactions extends Hen<InitialState> {
  pushAlert(a: Alert) {
    this.state.alerts.push();
  }
  removeTable(tName: string) {
    delete this.state.tables[tName];
  }
  setTable(tName: string, t: DB.Table) {
    this.state.tables[tName] = t;
  }
  createTable(tName: string, t: DB.Table) {
    if (!this.state.tables[tName]) {
      this.state.tables[tName] = t;
    }
  }
}

export const [menuReducer, actions] = hen(new EditorReactions(initialState));
export default menuReducer;

export function createTable(tName: string, t: DB.Table) {
  return (dispatch, getState) => {
    const state = getState();
    if (!!state.tables[tName]) {
      dispatch(actions.pushAlert({ status: AlertStatus.Success, message: "" }));
    }

    dispatch(actions.setTable(tName, t));
  };
}
