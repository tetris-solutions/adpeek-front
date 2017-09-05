const each = require('lodash/each')
const pick = require('lodash/pick')

module.exports = function passEnv () {
  const env = {}

  each(pick(process.env,

    'NODE_ENV',
    'ADPEEK_URL',
    'ADPEEK_API_URL',
    'NUMBERS_API_URL',
    'FRONT_HOST',
    'FRONT_URL',
    'USER_API_URL',
    'TKM_URL',
    'TOKEN_COOKIE_DOMAIN',
    'TOKEN_COOKIE_NAME',
    'LOCALE_COOKIE_NAME',
    'GMAPS_KEY'),

    function (value, key) {
      env[key] = `"${value}"`
    })

  return env
}
