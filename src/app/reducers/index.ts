import { combineReducers, Reducer } from "redux";
import { RootState } from "app/reducers/state";
import menu from "app/ducks/menu";
import pgeditor from "app/ducks/pgeditor";
export { RootState };

export const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  menu,
  pgeditor
});
