import { INIT_USER_LIST } from '../define/action/sample-action-define';

const initialState = {
    user_list :[{id: '0', name: 'john doh'}]
  };

export default function userListReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_USER_LIST:
      return Object.assign({}, state, action.data)

    default:
      return state
  }
}
