import { hen, Hen } from "app/util/createReducer";
import { downloadFile } from "app/util";
import { createSelector } from "reselect";
import * as DB from "app/models/pg";
import { RootState } from "app/reducers";
import { tableToSql } from "app/lib/sqlizer/psql";
import dagre from "dagre";

type TableMap = { [k: string]: DB.Table };
export interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}
export type TablePosMap = { [k: string]: Position };
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
  tablePositions: TablePosMap;
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
  tablePositions: {
    user: { x: 20, y: 100 },
    address: { x: 200, y: 100 },
  },
};

// Selectors
const mainSelector = (state: RootState) => state.editor;

export const tableSelector = createSelector(mainSelector, (editor) => ({
  tables: editor.tables,
  tableList: Object.keys(editor.tables).map((k) => editor.tables[k]),
  tablePositions: editor.tablePositions,
}));

export const getTables = createSelector(tableSelector, (ts) => ({
  tables: ts.tableList,
  tablePositions: ts.tablePositions,
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
  projectImported(t: TableMap) {
    this.state.tables = t;
  }
  updateTablePos(tName: string, t: Position) {
    this.state.tablePositions[tName] = t;
  }
  updateAllTablePos(p: { [tName: string]: Position }) {
    this.state.tablePositions = p;
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

export function exportProject() {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const { tables } = getTables(state);
    const projectExportShape = {
      tables,
      version: "v1",
    };

    downloadFile("export.tabua", "application/json", [
      JSON.stringify(projectExportShape),
    ]);
  };
}

export function importProject(file: string) {
  return (dispatch, getState: () => RootState) => {
    try {
      const j: { tables: TableMap } = JSON.parse(file);
      dispatch(actions.projectImported(j.tables));
    } catch (e) {}
  };
}

export function autoLayout() {
  return (dispatch, getState: () => RootState) => {
    const tables = getState().editor.tables;
    const tablePositions = getState().editor.tablePositions;
    // Create a new directed graph
    var g = new dagre.graphlib.Graph();

    // Set an object for the graph label
    g.setGraph({});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() {
      return {};
    });

    Object.keys(tables).forEach((tName) => {
      const pos = tablePositions[tName];
      g.setNode(tName, {
        label: tName,
        width: pos.width ?? 200,
        height: pos.height ?? 50,
      });
    });

    Object.keys(tables).forEach((tName) => {
      const t = tables[tName];
      t.references?.forEach((r) => {
        g.setEdge(tName, r.tableRef);
      });
    });

    dagre.layout(g);

    let updateTablePositions = { ...tablePositions };
    g.nodes().forEach(function(tName: string) {
      const layout = g.node(tName);
      updateTablePositions[tName] = {
        ...updateTablePositions[tName],
        x: layout.x,
        y: layout.y,
      };
    });
    dispatch(actions.updateAllTablePos(updateTablePositions));
  };
}
