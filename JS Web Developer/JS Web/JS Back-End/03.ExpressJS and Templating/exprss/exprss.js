const http = require('http');
const url = require('url');

function methodHandlerFactory(handlers, method) {
  return function(path, ...fns) {
    handlers[method][path] = fns;
  }
}

function iterateAndExecHandler(req, res, handlersArray) {
  const fn = handlersArray[0];
  if (!req) {
    done(req, res);
    return;
  }

  fn(req, res, function(err) {
    if (err) {
      console.error(err);
      return ;
    }

    const originalEnd = res.end.bind(res);
    res.end = function(data) {
      if (typeof data === 'object') {
        data = JSON.stringify(data);
      }

      originalEnd(data);
    }

    iterateAndExecHandler(req, res, handlersArray.slice(1));
  });
}

module.exports = function() {
  const handlers = {
    get: {},
    post: {},
    put: {},
    delete: {},
  };

  const server = http.createServer(function(req, res) {
    const {path, query} = url.parse(req.url, true);
    const method = req.method.toLocaleLowerCase();
    const reqHandlers = handlers[method][path];

    if (!reqHandlers) {
      res.end(`Route ${req.method} ${path} not found!`);
      return;
    }

    iterateAndExecHandler(req, res, reqHandlers);
  });

  return {
    listen: server.listen.bind(server),
    get: methodHandlerFactory(handlers, 'get'),
    post: methodHandlerFactory(handlers, 'post'),
  };
};