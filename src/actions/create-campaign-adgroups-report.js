import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

export function createCampaignAdGroupsReport (adGroups, config) {
  return POST(`${process.env.ADPEEK_API_URL}/report/adgroups`, assign(config, {body: adGroups}))
}

export function createCampaignAdGroupsReportAction (tree, {company, workspace, folder, campaign}, adGroups) {
  return createCampaignAdGroupsReport(adGroups, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
