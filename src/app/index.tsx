import * as React from 'react';
import { Route, Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import Test from 'app/containers/test';

export const App = hot(module)(() => (
    <Switch>
        <Route path="/" component={Test} />
    </Switch>
));