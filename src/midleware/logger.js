const logger = function actionDebugMiddleware() {
  return next => action => {
    console.info(action.type, action);
    next(action);
  };
};

export default logger
