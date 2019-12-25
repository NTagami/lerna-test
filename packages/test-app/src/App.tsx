import * as React from "react";
import { Action, Dispatch } from "redux";
import { Provider, connect, useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import store, { TodoState, RootState, history } from "./store";
import { TodoContainer } from "./TodoContainer";
import { GLTest } from "./GLTest";
import ErrorDisplay from "./ErrorDisplay";
import { MapTest } from "./MapTest";
import { ThreeTest } from "./ThreeTest";
import { GestureTest } from "./GestureTest";
import Drawer from "@material-ui/core/Drawer";
import { useButtonHelper } from "./CommonStyles";
import { push } from "connected-react-router";
import { Three2 } from "./Three2";

const Container: React.FC = () => {
  const dispatch: Dispatch<Action> = useDispatch();
  const todo = useSelector<RootState, TodoState>(st => st.todoState);

  const todoProps = { ...todo, dispatch };
  const button = useButtonHelper();

  const [drawerOpen, openDrawer] = React.useState(false);
  const cbOpenDrawer = React.useCallback(() => openDrawer(true), []);
  const cbCloseDrawer = React.useCallback(() => openDrawer(false), []);

  return (
    <React.Fragment>
      {button("Drawer", cbOpenDrawer)}
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <TodoContainer {...todoProps} />}
          />
          <Route exact path="/gl" render={() => <GLTest />} />
          <Route exact path="/map" render={() => <MapTest />} />
          <Route exact path="/three" render={() => <ThreeTest />} />
          <Route exact path="/gesture" render={() => <GestureTest />} />
          <Route exact path="/three2" render={() => <Three2 />} />
          <Route render={() => <div>Unexpected path</div>} />
        </Switch>
      </ConnectedRouter>
      <Drawer open={drawerOpen} onClose={cbCloseDrawer}>
        {button("Main", () => dispatch(push("/")))}
        {button("GL", () => dispatch(push("/gl")))}
        {button("Map", () => dispatch(push("/map")))}
        {button("Three", () => dispatch(push("/three")))}
        {button("Gesture", () => dispatch(push("/gesture")))}
        {button("Three2", () => dispatch(push("/three2")))}
      </Drawer>
      <ErrorDisplay />
    </React.Fragment>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};
export default App;
