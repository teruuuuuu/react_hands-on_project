import { combineReducers } from 'redux'
import sampleReducer from './sample-reducer'
import userListReducer from './userlist-reducer'

const rootReducer = combineReducers({
  sampleReducer,
  userListReducer
})
export default rootReducer
