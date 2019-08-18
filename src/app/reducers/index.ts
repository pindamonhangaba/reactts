import { Reducer } from 'redux';
import { combineReducers } from 'redux-immer';
import produce from 'immer';
import { RootState } from 'app/reducers/state';
import { menuReducer } from 'app/ducks/menu';
import henReducer from 'app/ducks/hen';
export { RootState };

export const rootReducer: Reducer<RootState> = combineReducers<RootState>(produce, {
  menu: menuReducer,
  hen: henReducer,
});
