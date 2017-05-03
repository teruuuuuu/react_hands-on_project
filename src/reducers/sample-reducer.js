import { CHANGE_TEXT } from '../define/action/sample-action-define'

const initialState = {
    text : 'init text'
  };

export default function sampleReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_TEXT:
      return Object.assign({}, state, { text: action.text})

    default:
      return state
  }
}
