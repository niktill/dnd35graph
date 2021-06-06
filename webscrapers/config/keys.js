// config keys
let keys;
if (process.env.NODE_ENV == 'production') {
  keys = {
    DATABASE_URL: process.env.DATABASE_URL,
  };
} else {
  const devKeys = require('./dev_keys.js');
  keys = devKeys;
}
module.exports = keys;
