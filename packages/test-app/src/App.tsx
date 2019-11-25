import * as React from "react";
import { Provider, connect } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import store, { TodoState, RootState, history } from "./store";
import { TodoContainer } from "./TodoContainer";
import { GLTest } from "./GLTest";
import ErrorDisplay from "./ErrorDisplay";
import { MapTest } from "./MapTest";

const TodoRoot = connect<TodoState, {}, {}, RootState>(st => st.todoState)(
  TodoContainer
);
const MapRoot = connect<{}, {}, {}, RootState>(st => st)(MapTest);
const GLRoot = connect<{}, {}, {}, RootState>(st => st)(GLTest);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" render={() => <TodoRoot />} />
          <Route exact path="/gl" render={() => <GLRoot />} />
          <Route exact path="/map" render={() => <MapRoot />} />
          <Route render={() => <div>Unexpected path</div>} />
        </Switch>
      </ConnectedRouter>
      <ErrorDisplay />
    </Provider>
  );
};
export default App;
