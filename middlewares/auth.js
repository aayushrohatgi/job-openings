const expressJwt = require('express-jwt');

function isAuthenticated() {
  return expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });
}

module.exports = {
  isAuthenticated,
};
