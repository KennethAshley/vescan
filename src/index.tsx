import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createGlobalStyle } from 'styled-components';
import WebFont from 'webfontloader';

import Home from './routes/Home';
import {
  List as Accounts,
  Show as Account,
} from './routes/Accounts';

import {
  List as Transactions,
  Show as Transaction,
} from './routes/Transactions';

import {
  List as Blocks,
  Show as Block,
} from './routes/Blocks';

import Layout from './components/Layout';

import 'antd/dist/antd.css';
import './index.css';

import * as serviceWorker from './serviceWorker';

WebFont.load({
  google: {
    families: ['Calistoga'],
  },
});

const GlobalStyle = createGlobalStyle`
  .container {
    margin: 0 auto;
    max-width: 1280px;
  }
`;

ReactDOM.render(
  <Router>
    <Layout>
      <Switch>
        <Route path="/transaction/:id">
          <Transaction />
        </Route>
        <Route path="/transactions">
          <Transactions />
        </Route>
        <Route path="/block/:id">
          <Block />
        </Route>
        <Route path="/blocks">
          <Blocks />
        </Route>
        <Route path="/account/:address">
          <Account />
        </Route>
        <Route path="/accounts">
          <Accounts />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Layout>
    <GlobalStyle />
  </Router>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
