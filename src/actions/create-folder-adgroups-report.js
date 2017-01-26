import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function createAdGroupsReport (adGroups, config) {
  return POST(`${process.env.ADPEEK_API_URL}/report/adgroups`, assign(config, {body: adGroups}))
}

export function createAdGroupsReportAction (tree, params, adGroups) {
  return createAdGroupsReport(adGroups, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
