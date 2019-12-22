import * as React from "react";

import TextField from "@material-ui/core/TextField";
import { Todo } from "./types";
import { useButtonHelper } from "./CommonStyles";

interface Props {
  todos: Todo[];
  onClickAddButton: (todo: string) => void;
}

interface State {
  text: string;
}

const TodoComponent: React.FC<Props> = ({ todos, onClickAddButton }) => {
  const [state, setState] = React.useState<State>({ text: "" });

  const button = useButtonHelper();
  const { text } = state;

  const cbOnAdd = React.useCallback(() => onClickAddButton(text), [
    onClickAddButton,
    text
  ]);

  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      <h1>TODO</h1>
      <TextField
        value={text}
        onChange={e => setState({ text: e.currentTarget.value })}
      />
      {button("Add todo", cbOnAdd)}
      {React.useMemo(
        () => (
          <ul>
            {todos.map((o, i) => (
              <li key={i}>{o.title}</li>
            ))}
          </ul>
        ),
        [todos]
      )}
    </div>
  );
};

export default TodoComponent;
