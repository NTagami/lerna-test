import * as React from "react";
import { Provider, connect } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import store, { TodoState, RootState, history, DummyState } from "./store";
import { TodoContainer } from "./TodoContainer";
import GLTestContainer from "./GLTestContainer";
import ErrorDisplay from "./ErrorDisplay";
import { MapTest } from "./MapTest";

const ConnectTodo = connect<TodoState, {}, {}, RootState>(st => st.todoState)(
  TodoContainer
);
const MapRoot = connect<DummyState, {}, {}, RootState>(st => st.dummy)(MapTest);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" render={() => <ConnectTodo />} />
          <Route exact path="/hoge" render={() => <GLTestContainer />} />
          <Route exact path="/map" render={() => <MapRoot />} />
          <Route render={() => <div>Unexpected path</div>} />
        </Switch>
      </ConnectedRouter>
      <ErrorDisplay />
    </Provider>
  );
};
export default App;
