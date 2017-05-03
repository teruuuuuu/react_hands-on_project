import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import FirstComponent from './components/first-component'
import StoreConfig from './store/store-config'

import './assets/bootstrap/css/bootstrap.min.css'

const store = StoreConfig()
render(
  <Provider store={store}>
    <FirstComponent />
  </Provider >
  , document.getElementById('app')
);
