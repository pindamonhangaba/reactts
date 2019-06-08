import { hen, Hen } from "app/util/createReducer";
import { Table } from "models/pg";
import { ThunkAction } from "redux-thunk";
//import { createSelector } from 'reselect';
//import { RootState } from 'app/reducers';

export interface Models {
  tables: { [name: string]: Table };
}

const initialState: Models = {
  tables: {}
};

class PGEditor extends Hen<Models> {
  increment = () => {
    console.log("incrementing");
  };
  appendTable = (name: string) => {
    this.state.tables[name] = { name, columns: [] } as Table;
  };
}

const [reducer, actionCreators] = hen(new PGEditor(initialState));

export const actions = {
  createTable: (name: string) => {
    return ((dispatch: any, getState: () => Models) => {
      setTimeout(() => dispatch(actionCreators.appendTable(name), 4000));
    }) as ThunkAction<void, Models, void, never>;
  }
};
export default reducer;
