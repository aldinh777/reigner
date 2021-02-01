# Reigner

Reigner (Recursive Express Router Signer) is a tool to automaticly sign router based on its directory structure

## installation

```sh
$ npm i reigner
```

## simple usage

```js
const reigner = require('reigner');
const path = require('path');

// this is wrapper for express.js
const app = reigner();

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
const express = require('express');
const path = require('path');

const app = express();

app.use('/', require('./routes/index'));
app.use('/chicken', require('./routes/chicken'));
app.use('/hello', require('./hello/index'));
app.use('/hello/test', require('./hello/test'))

app.listen(3000);
```

## router maker

a simple tool if you think you are creating the same kind of routers repeatedly and the differences is only the resource (e.g. rest api)

```js
const reigner = require('reigner');

const davidModel      = {name: 'David'};
const reynoldModel    = {name: 'Reynold'};

const davidRouter = createRouter(davidModel);
const reynoldRouter = createRouter(reynoldModel);

const createRouter = reigner.routerMaker(function(router, resource) {
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
const express = require('express');

const davidRouter = express.Router();
const reynoldRouter = express.Router();

const davidModel      = { name: 'David' };
const reynoldModel    = { name: 'Reynold' };

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
const reigner = require('reigner');
const path = require('path');

const app = reigner();

const createRouter = reigner.routerMaker(function(router, resource) {
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
const express = require('express');

const app = express();

const davidResource = require('./models/david');
const reynoldResource = require('./models/reynold');

const davidRouter = express.Router();
const reynoldRouter = express.Router();

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