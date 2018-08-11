const axios = require('axios');
const jsonWebToken = require('jsonwebtoken');
const config = require('./config.json');
const helper = require('./helper');

function Authentication(options = {}) {

  async function facebookAuth(accessToken) {
    return axios.get('https://graph.facebook.com/me?access_token=' + accessToken)
      .then(response => {
        const user = options.db.get('users').find({ facebookId: response.data.id }).value();
        if (user) {
          return user;
        }
        const [firstName, lastName] = response.data.name.split(' ');
        const newUser = {
            ...helper.createUser(response.data.id, options.db.get().value()),
            firstName,
            lastName,
            facebookId: response.data.id
        };
        options.db.get('users').push(newUser).write();
        return newUser;
      })
  }

  function basicAuth(login, password) {
    const user = options.db.get('users').find({ login }).value();

    if (!user || password !== 'admin') {
      throw new Error('not found');
    }
    return user;
  }

  async function auth(request, response, next) {
    const accessToken = request.get('FacebookAccessToken');
    let userData = null;
    const { login, password } = request.body;

    try {
      if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
        userData = await facebookAuth(accessToken);
      } else if (options.db && login) {
        userData = basicAuth(login, password);
      }

      const user = {
        id: userData.id,
        name: userData.firstName + ' ' + userData.lastName,
      };

      const token = jsonWebToken.sign(user, config.SECRET_TOKEN);
      response.status(200).send({ token });
    } catch (e) {
      response.status(401).send();
    }
  }

  return auth;
}

module.exports = Authentication;