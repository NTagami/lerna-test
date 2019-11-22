import produce from "immer";
import { Action, Reducer } from "redux";
import {
  Cmd,
  combineReducers,
  LiftedLoopReducer,
  loop,
  Loop
} from "redux-loop";

import {
  CommonAction,
  dummyAction,
  TodoAction,
  addTodo,
  errorMessage,
  clearError
} from "./action";
import { CommonState, RootState, TodoState } from "./store";
import { connectRouter } from "connected-react-router";
import { History } from "history";
import { getType } from "typesafe-actions";

const initialTodoState: TodoState = {
  todos: []
};

const todoReducer = (
  state: TodoState = initialTodoState,
  action: TodoAction
): TodoState | Loop<TodoState, Action> => {
  switch (action.type) {
    case getType(addTodo):
      return loop(
        produce(state, draft => {
          draft.todos.push(action.payload.todo);
        }),
        Cmd.action(dummyAction(action.payload.todo.title))
      );
    default:
      const _: never = action.type;
      return state;
  }
};

const commonReducer: Reducer<CommonState, CommonAction> = (
  state: CommonState = { dummy: "", error: null },
  action: CommonAction
): CommonState => {
  switch (action.type) {
    case getType(dummyAction):
      return state;
    case getType(errorMessage):
      return produce(state, draft => {
        draft.error = action.payload.message;
      });
    case getType(clearError):
      return produce(state, draft => {
        draft.error = null;
      });

    default:
      const _: never = action;
      return state;
  }
};

export const createReducer: (
  h: History
) => LiftedLoopReducer<RootState> = history =>
  combineReducers({
    router: connectRouter(history),
    todoState: todoReducer,
    common: commonReducer
  } as any); // TODO: FIX!
