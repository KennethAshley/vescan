import React, { Fragment, useContext } from 'react';
import { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './routes/Home';

import Trade from './routes/Trade';
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
import Search from './components/Search';

import 'antd/dist/antd.css';
import './index.css';

const GlobalStyle = createGlobalStyle`
  .container {
    margin: 0 auto;
    max-width: 1280px;
  }
`;


function App() {
  return (
    <Fragment>
      <Router>
        <Layout>
          <Search />
          <Switch>
            <Route path="/trade">
              <Trade />
            </Route>
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
      </Router>
      <GlobalStyle />
    </Fragment>
  );
}

export default App;
