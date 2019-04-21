import * as React from 'react';
import { Route, Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import Containers from 'app/containers';

export const App = hot(module)(() => (
    <Switch>
        <Route path="/" component={Containers} />
    </Switch>
));