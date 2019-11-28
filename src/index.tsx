import React from 'react';
import ReactDOM from 'react-dom';
import 'event-source-polyfill';
import WebFont from 'webfontloader';
import ReactGA from 'react-ga';

import App from './App';
import Price from './contexts/Price';

import 'antd/dist/antd.css';
import './index.css';

import * as serviceWorker from './serviceWorker';

ReactGA.initialize('UA-153527765-1');

WebFont.load({
  google: {
    families: ['Calistoga'],
  },
});

ReactDOM.render(
  <Price>
    <App />
  </Price>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
