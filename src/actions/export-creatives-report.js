import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import assign from 'lodash/assign'

function exportCreativesReport (adGroups, config) {
  return POST(`${process.env.ADPEEK_API_URL}/report/creatives`, assign(config, {body: adGroups}))
}

export function exportCreativesReportAction (tree, params, adGroups) {
  return exportCreativesReport(adGroups, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
