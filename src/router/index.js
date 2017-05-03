import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';

import BaseContainer from './container/base/Base';
import DarkBaseContainer from './container/base/DarkBase';
import App from './container/app';
import Board from './container/Board';
import MaterialDialog from './component/material-dialog'
import TodoContainer from './container/TodoContainer';

export const urls = {
  index: '/',
  board: '/board',
  material: '/material',
  test: '/test',
  todo: '/todo',

};



export const routes = (
  [
   <Route path={urls.index} component={DarkBaseContainer}><IndexRoute component={TodoContainer} /></Route>,
   <Route path={urls.todo} component={DarkBaseContainer}><IndexRoute component={TodoContainer} /></Route>,
   <Route path={urls.board} component={DarkBaseContainer}><IndexRoute component={Board} /></Route>,
   <Route path={urls.material} component={DarkBaseContainer}><IndexRoute component={MaterialDialog} /></Route>,
   <Route path={urls.test} component={DarkBaseContainer}><IndexRoute component={App} /></Route>]
);
