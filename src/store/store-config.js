import { createStore, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk'
import logger from '../midleware/logger'
import api_caller from '../midleware/api_caller'
import rootReducer from '../reducers'

export default function StoreConfig(preloadedState) {
  const finalCreateStore = applyMiddleware(thunk, logger, api_caller )(createStore);
  const store = finalCreateStore(rootReducer, preloadedState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
