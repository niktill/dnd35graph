// config keys
let keys;
if (process.env.NODE_ENV == 'production') {
  keys = {
    PG_CONNECTION: {
      USER: process.env.PG_USER,
      HOST: process.env.PG_HOST,
      DATABASE: process.env.PG_DATABASE,
      PASSWORD: process.env.PG_PASSWORD,
      PORT: process.env.PG_PORT,
    },
  };
} else {
  const devKeys = require('./dev_keys.js');
  keys = devKeys;
}
export default keys;
