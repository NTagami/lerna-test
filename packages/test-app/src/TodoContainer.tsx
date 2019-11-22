import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { addTodo, errorMessage } from "./action";
import { RootState, TodoState } from "./store";
import TodoComponent from "./TodoComponent";
import { push } from "connected-react-router";

type Props = TodoState & DispatchProp;

export const TodoContainer: React.FC<Props> = ({ todos, dispatch }) => {
  return (
    <TodoComponent
      todos={todos}
      onClickAddButton={todo => dispatch(addTodo(todo))}
      gotoHoge={() => {
        //dispatch(errorMessage("TEST"));
        dispatch(push("/hoge"));
      }}
    />
  );
};
/*
export default connect<TodoState, {}, {}, RootState>(st => st.todoState)(
  TodoContainer
);
*/
