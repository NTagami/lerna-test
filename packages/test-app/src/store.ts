import {
  applyMiddleware,
  Action,
  compose,
  createStore,
  Store,
  StoreEnhancer
} from "redux";
import { install, StoreCreator } from "redux-loop";

import { createReducer } from "./reducer";
import { createBrowserHistory, History, LocationState } from "history";
import { routerMiddleware } from "connected-react-router";
import { Todo } from "./types";

export const history: History<LocationState> = createBrowserHistory();

interface ExtendedWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
declare var window: ExtendedWindow;

const composeReduxDevToolsEnhancers =
  (typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export interface TodoState {
  todos: Todo[];
}

export interface CommonState {
  dummy: string;
  error: string | null;
}

export interface RootState {
  todoState: TodoState;
  common: CommonState;
}

const enhancer = composeReduxDevToolsEnhancers(
  applyMiddleware(routerMiddleware(history)) as any,
  install()
) as StoreEnhancer<RootState>;

const enhancedCreateStore = createStore as StoreCreator;
const store: Store<RootState, Action> = enhancedCreateStore(
  createReducer(history),
  undefined,
  enhancer
);

export default store;
