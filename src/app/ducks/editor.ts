import { hen, Hen } from 'app/util/createReducer';
//import { createSelector } from 'reselect';
//import { RootState } from 'app/reducers';

export interface MenuItem {
  title: string;
  description?: string;
  to: string;
  icon: string;
  permissions?: Array<string>;
}

// Actions
export const ActionTypes = {};

// Reducers


interface MyRedux {
  phrase?: string
}

const initialState: MyRedux = {};

class MyAction extends Hen<MyRedux> {
  sayHi(say: string) {
    this.state.phrase = say;
  };

  async fetchGreetings() {
    return (dispatch) => {
      return this.sayHi('okok');
    };
  }
}

//export const menuReducer = createReducer(initialState, {});

// Selectors
//const mainSelector: any = (state: RootState) => state.menu;


export const [menuReducer, actions] = hen(new MyAction(initialState));

actions.sayHi('23')

export default menuReducer;