import { hen, Hen } from "app/util/createReducer";
import { createSelector } from "reselect";
import DB from "models/pg";
import { RootState } from "app/reducers";

type TableMap = { [k: string]: DB.Table };

export interface InitialState {
  tables: TableMap;
}

const initialState: InitialState = {
  tables: {},
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

class EditorReactions extends Hen<InitialState> {
  removeTable(tName: string) {
    delete this.state.tables[tName];
  }
  setTable(tName: string, t: DB.Table) {
    this.state.tables[tName] = t;
  }
}

export const [menuReducer, actions] = hen(new EditorReactions(initialState));
export default menuReducer;
