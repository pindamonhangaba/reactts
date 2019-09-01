import * as React from "react";
import { Route, Switch } from "react-router";
import { hot } from "react-hot-loader";
import Editor from "app/containers/editor/Editor";
import ModalContainer from "react-modal-promise";

export const App = hot(module)(() => (
  <React.Fragment>
    <Switch>
      <Route path="/" component={Editor} />
    </Switch>
    <ModalContainer />
  </React.Fragment>
));
