const express = require('express');
const expressRouter = express.Router();
const path = require('path');
const fs = require('fs');

function recursiveRead(location, callback) {
  const directoryContent = fs.readdirSync(location);

  directoryContent.forEach(function(content) {
    if (content.endsWith('.js')) {
      const path = content.slice(0, content.length - 3);
      callback(true, path);
    } else {
      callback(false, content);
    }
  });
}

function reigner () {
  const app = express();

  app.routers = function(pattern, location) {
    var directoryQueue = [];
    const signRoute = (route) => {
      const routeName = path.join(pattern, route).replace(/\\/g, '/');
      const routerPath = path.join(location, route);
      const router = require(routerPath);
      app.use(routeName, router);
    };

    recursiveRead(location, function(isRouter, content) {
      if (isRouter) {
        const route = (content === 'index') ? '' : content;
        signRoute(route);
      } else {
        directoryQueue.push(content);
      }
    });

    directoryQueue.forEach(function(content) {
      app.routers(path.join(pattern, content), path.join(location, content));
    });
  }
  
  app.resources = function(pattern, location, routerMaker) {
    recursiveRead(location, function(route) {
      var resource = require(path.join(location, route));
      resource.name = resource.name || route;
      app.use(path.join(pattern, route), routerMaker(resource));
    });
  };

  return app;
}

reigner.routerMaker = function(callback) {
  return function(resource) {
    var router = expressRouter();
    callback(router, resource);
    return router;
  }
}

exports = module.exports = reigner;

