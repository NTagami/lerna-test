import { toTodoId } from "./types";
import { createAction, ActionType } from "typesafe-actions";

export const addTodo = createAction("ADD_TODO", (todo: string) => ({
  todo: {
    id: toTodoId("dummy"),
    title: todo
  }
}))();

export const dummyAction = createAction("DUMMY", (message: string) => ({
  message
}))();
export const errorMessage = createAction("ERROR", (message: string) => ({
  message
}))();
export const clearError = createAction("CLEAR_ERROR")();

export type TodoAction = ActionType<typeof addTodo>;
export type CommonAction =
  | ActionType<typeof dummyAction>
  | ActionType<typeof errorMessage>
  | ActionType<typeof clearError>;
