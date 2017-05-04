import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import StoreConfig from './store/store-config'

import './assets/bootstrap/css/bootstrap.min.css'
import './assets/css/main.css'

import {  BrowserRouter, Route, Switch } from 'react-router-dom';
import FirstConponent from './components/first-component';
import ListComponent from './components/list-component';


const store = StoreConfig()

render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={FirstConponent} />
        <Route exact path="/first" component={FirstConponent} />
        <Route exact path="/list" component={ListComponent} />
      </Switch>
    </BrowserRouter>
  </Provider >
  , document.getElementById('app')
);
