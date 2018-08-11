const jsonWebToken = require('jsonwebtoken');
const config = require('./config.json');

function AuthorizatonMiddleware(options = {}) {

  function isAuthorized(token) {
    try {
      const [, key] = token.split(' ');
      return jsonWebToken.verify(key, config.SECRET_TOKEN);
    } catch (e) {
      return false;
    }
  }

  function canActivate(url) {
    const list = options.whiteList || [];
    return !list.some(item => new RegExp(item).test(url));
  }

  function middleware(request, response, next) {
    if (!canActivate(request.originalUrl)) {
      return next();
    }
    const authorization = request.get('Authorization');
    if (authorization && isAuthorized(authorization)) {
      return next();
    }

    response.set({
      'Access-Control-Expose-Headers': 'Location',
      'Location': '/api/auth'
    });
    response.status(401).send();
  }

  return middleware;
}

module.exports = AuthorizatonMiddleware;