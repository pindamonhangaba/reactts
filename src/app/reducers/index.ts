import { combineReducers, Reducer } from 'redux';
import { RootState } from 'app/reducers/state';
import { menuReducer } from 'app/ducks/menu';
export { RootState };

export const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  menu: menuReducer,
});
