import * as React from "react";

import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import { Todo } from "./types";
import { useButtonHelper } from "./CommonStyles";

interface Props {
  todos: Todo[];
  onClickAddButton: (todo: string) => void;
  gotoHoge: () => void;
}

interface State {
  text: string;
}

const TodoComponent: React.FC<Props> = ({
  todos,
  onClickAddButton,
  gotoHoge
}) => {
  const [state, setState] = React.useState<State>({ text: "" });
  const [drawerOpen, openDrawer] = React.useState(false);

  const button = useButtonHelper();
  const { text } = state;

  const cbOpenDrawer = React.useCallback(() => openDrawer(true), []);
  const cbCloseDrawer = React.useCallback(() => openDrawer(false), []);
  const cbOnAdd = React.useCallback(() => onClickAddButton(text), [onClickAddButton, text]);

  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      <h1>TODO</h1>
      <TextField
        value={text}
        onChange={e => setState({ text: e.currentTarget.value })}
      />
      {button("Add todo", cbOnAdd)}
      {button("Drawer", cbOpenDrawer)}
      {button("GL", gotoHoge)}
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
      <Drawer open={drawerOpen} onClose={cbCloseDrawer}>
        Drawer
      </Drawer>
    </div>
  );
};

export default TodoComponent;
