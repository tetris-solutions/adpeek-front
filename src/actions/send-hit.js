import {saveResponseTokenAsCookie, getApiFetchConfig} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'

function sendHit (company, level, target = null, config) {
  const query = target ? `?target=${target}` : ''

  return PUT(`${process.env.ADPEEK_API_URL}/company/${company}/hit/${level}${query}`, config)
}

export function sendHitAction (tree, company, level, target, token) {
  return sendHit(company, level, target, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
}
