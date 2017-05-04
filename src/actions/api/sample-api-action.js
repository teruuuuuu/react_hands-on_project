import * as types from '../../define/action/sample-action-define'

export function callApi(remote) {
  return { type: types.CALL_API, remote:remote}
}


export function  user_list_init() {
  const response_action = function(data){
    return {type: types.INIT_USER_LIST, data: data}
  }

  const data = {}
  return createRequestData( process.env.REQUEST_URL.USER_LIST_INIT, 'JSON', 'GET',  data,  response_action);
}

function createRequestData(url, dataType, type, data, response_action){
    return { url: url,
             dataType:dataType,
             type:type,
             data:  data,
             response_action: response_action,
             contentType: 'application/x-www-form-urlencoded; charset=UTF-8' }
}
