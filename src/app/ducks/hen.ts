import { hen, Hen } from "app/util/createReducer";
import { createSelector } from "reselect";
import { RootState } from "app/reducers";

export interface InitialState {
  phrase?: string;
  items: Array<any>;
  data: any;
}

const initialState: InitialState = {
  items: [],
  data: {},
};

class HenTest extends Hen<InitialState> {
  addItem = (item: string) => {
    this.state.items = [...this.state.items, item];
    return this.state;
  };
}

// Selectors
const ItemsSelector = (state: RootState) => {
  return state.hen.items;
};

export const itemsSelector = createSelector(
  ItemsSelector,
  (state) => {
    return { items: state };
  }
);

export const [henReducer, actions] = hen(new HenTest(initialState));

export default henReducer;
