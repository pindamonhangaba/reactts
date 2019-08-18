import { hen, Hen } from 'app/util/createReducer';
import { createSelector } from 'reselect';
import { RootState } from 'app/reducers';

export interface MenuItem {
  title: string;
  description?: string;
  to: string;
  icon: string;
  permissions?: Array<string>;
}

type Item = {
  value: string,
  label: string
}

export interface InitialState {
  phrase?: string
  items: Array<Item>
}

const initialState: InitialState = {
  items: [],
};

class MyAction extends Hen<InitialState> {
  sayHi = (say: string) => {
    this.state.phrase = say;
  };
}

// Selectors
const mainSelector = (state: RootState) => state.menu;

const itemsSelector = createSelector(mainSelector, (state) => state.items);


itemsSelector;

export const [menuReducer, actions] = hen(new MyAction(initialState));

export default menuReducer;