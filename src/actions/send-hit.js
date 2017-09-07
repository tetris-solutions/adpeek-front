import {saveResponseTokenAsCookie, getApiFetchConfig} from '@tetris/front-server/utils'
import {PUT} from '@tetris/http'
import qs from 'query-string'

function sendHit (level, params, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/hit/${level}?${qs.stringify(params)}`, config)
}

export function sendHitAction (tree, level, params, token) {
  return sendHit(level, params, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
}
