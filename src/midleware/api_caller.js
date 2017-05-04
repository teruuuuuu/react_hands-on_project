import {CALL_API} from '../define/action/sample-action-define'
import $      from 'jquery'


const api_caller = function actionApiCall() {

  function remoteService(next, remote){
    $.ajax({
        url: remote.url,
        dataType: remote.dataType,
        type: remote.type,
        data: remote.data,
        cache: false,
        scriptCharset: 'utf-8',
        success: data => {
          const new_action = remote.response_action(data)
          if(new_action.type == CALL_API){
            remoteService(next, new_action.remote)
          }else{
            next(new_action)
          }
        },
        error: data => {
          console.info(data)
        }
    });
  }

  return next => action => {
    if(action.type == CALL_API){
      remoteService(next, action.remote)
    }else{
      next(action)
    }
  };
};


export default api_caller
