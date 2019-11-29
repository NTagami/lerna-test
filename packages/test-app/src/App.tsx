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

const Container: React.FC = () => {
  const dispatch: Dispatch<Action> = useDispatch();
  const todo = useSelector<RootState, TodoState>(st => st.todoState);
  const dispatchProps = { dispatch };
  const todoProps = { ...todo, dispatch };

  return (
    <React.Fragment>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <TodoContainer {...todoProps} />}
          />
          <Route
            exact
            path="/gl"
            render={() => <GLTest {...dispatchProps} />}
          />
          <Route
            exact
            path="/map"
            render={() => <MapTest {...dispatchProps} />}
          />
          <Route render={() => <div>Unexpected path</div>} />
        </Switch>
      </ConnectedRouter>
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
