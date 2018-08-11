const path = require('path');
const express = require('express');
const jsonServer = require('json-server');
const jsonWebToken = require('jsonwebtoken');
const faker = require('faker');
const authorizationMiddleware = require('./authorization');
const authentication = require('./authentication');
const config = require('./config.json');

const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
const server = jsonServer.create();

server.use((request, response, next) => {
  request.headers['content-type'] = 'application/json';
  next();
});

server.use('/static', express.static(path.join(__dirname, 'static')));
server.use(jsonServer.bodyParser);

server.use((request, response, next) => {
  if (['POST', 'PUT'].includes(request.method) && !request.body.id) {
    request.body.id = faker.random.uuid();
  }
  next();
});

server.use(middlewares);

if (config.AUTH_REQUIRED) {
  server.use(authorizationMiddleware({
    whiteList: [
      /^\/$/,
      /^\/static/,
      /^\/api\/auth$/
    ]
  }));
  server.use('/api/auth', authentication({
    db: router.db
  }));
}

server.use('/api/identify/:id', (request, response, next) => {
  const id = request.params.id;
  const { db } = router;

  const user = db.get('users').find({ id }).value();
  if (user) {
    return response.jsonp({ user, objectType: 'user' });
  }
  const device = db.get('devices').find({ id }).value();
  if (device) {
    return response.jsonp({ device, objectType: 'device' });
  }
  const place = db.get('places').find({ id }).value();
  if (place) {
    return response.jsonp({ place, objectType: 'place' });
  }
  const office = db.get('offices').find({ id }).value();
  if (office) {
    return response.jsonp({ office, objectType: 'office' });
  }
  response.status(404).send();
});


server.use('/api/users/current', (request, response, next) => {
    const { db } = router;
    const [,token] = (request.get('Authorization') || '').split(' ');
    const { id } = jsonWebToken.decode(token);
    const user = db.get('users').find({ id }).value();
    if (user) {
        response.jsonp(user);
    } else {
        response.status(404).send();
    }
});

const findResource = (id) => {
  const { db } = router;
  return db.get('users').find({ id }).value() || db.get('places').find({ id }).value();
};

const containsValue = (element = {}, value) => {
  return Object.values(element).some(item => item && item.indexOf && item.indexOf(value) > -1);
};

server.use('/api/devices', (request, response, next) => {
  const q = request.query.search;
  if (!q) {
    return next();
  }
  const { db } = router;
  const devices = db.get('devices').value();
  const result = devices.filter((device) => {
    return containsValue(device, q) ||
      containsValue(findResource(device.belongsToId), q);
  });
  response.jsonp(result);
});

server.use('/api', router);

server.listen(config.SERVER_PORT, () => {
  console.log('JSON Server is running on port ' + config.SERVER_PORT)
});
