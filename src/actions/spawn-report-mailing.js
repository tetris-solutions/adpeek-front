import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function spawnReportMailing (mailing, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/mailing/${mailing}/spawn`, config)
}

export function spawnReportMailingAction (tree, mailing) {
  return spawnReportMailing(mailing, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
