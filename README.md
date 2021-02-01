# Reigner

Reigner (Recursive Express Router Signer) is a tool to automaticly sign router based on its directory structure

## installation

```sh
$ npm i reigner
```

## simple usage

```js
var express = require('express');
var path = require('path');
var reigner = require('reigner');

var application = express();
var app = reigner.alterExpress(application);

app.routers('/', path.join(__dirname, './routes'));

app.listen(3000);
```

with that script, all router in directory "routes" will be automatically signed

example, if we add these files
- routes/index.js
- routes/chicken.js
- routes/hello/index.js
- routes/hello/test.js

the script now will equivalent with this
```js
var express = require('express');
var path = require('path');

var app = express();

app.use('/', require('./routes/index'));
app.use('/chicken', require('./routes/chicken'));
app.use('/hello', require('./hello/index'));
app.use('/hello/test', require('./hello/test'))

app.listen(3000);
```

## router maker

a simple tool if you think you are creating the same kind of routers repeatedly and the differences is only the resource (e.g. rest api)

```js
var reigner = require('reigner');

var davidModel      = {name: 'David'};
var reynoldModel    = {name: 'Reynold'};

var davidRouter = createRouter(davidModel);
var reynoldRouter = createRouter(reynoldModel);

var createRouter = reigner.routerMaker(function(router, resource) {
  router.get('/', function(req, res, next) {
    res.send(resource.name);
  });
  router.get('/:change', function(req, res, next) {
    resource.name = req.params.change;
    res.send(resource.name);
  });
});
```
that code will be equivalent with this

```js
var express = require('express');

var davidRouter = express.Router();
var reynoldRouter = express.Router();

var davidModel      = { name: 'David' };
var reynoldModel    = { name: 'Reynold' };

davidRouter.get('/', function(req, res, next) {
  res.send(davidModel.name);
});

davidRouter.get('/:change', function(req, res, next) {
  davidModel.name = req.params.change;
  res.send(davidModel.name);
});

reynoldRouter.get('/', function(req, res, next) {
  res.send(reynoldModel.name);
});

reynoldRouter.get('/:change', function(req, res, next) {
  reynoldModel.name = req.params.change;
  res.send(reynoldModel.name);
});
```

## automatic resource routing

```js
var express = require('express');
var path = require('path');
var reigner = require('reigner');

var application = express();
var app = reigner.alterExpress(application);

var createRouter = reigner.routerMaker(function(router, resource) {
  router.get('/', function(req, res, next) {
    res.send(resource.name);
  });
  router.get('/:change', function(req, res, next) {
    resource.name = req.params.change;
    res.send(resource.name);
  });
});

app.resources('/', path.join(__dirname, './models'), createRouter);

app.listen(3000);
```
with that script, all resource in directory "models" will have it's own router based on the routermaker

example, if we add these files
- models/david.js
- models/reynold.js

now the script is equivalent with these
```js
var express = require('express');

var app = express();

var davidResource = require('./models/david');
var reynoldResource = require('./models/reynold');

var davidRouter = express.Router();
var reynoldRouter = express.Router();

davidRouter.get('/', function(req, res, next) {
  res.send(davidResource.name);
});

davidRouter.get('/:change', function(req, res, next) {
  davidResource.name = req.params.change;
  res.send(davidResource.name);
});

reynoldRouter.get('/', function(req, res, next) {
  res.send(reynoldResource.name);
});

reynoldRouter.get('/:change', function(req, res, next) {
  reynoldResource.name = req.params.change;
  res.send(reynoldResource.name);
});

app.use('/david', davidRouter);
app.use('/reynold', reynoldRouter);

app.listen(3000);
```