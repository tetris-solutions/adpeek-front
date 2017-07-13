import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {saveResponseData} from '../functions/save-response-data'
import concat from 'lodash/concat'

function createConversionTracker (folder, conversionTracker, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/conversion-tracker`, assign({body: conversionTracker}, config))
}

const push = (newConversion, ls) => concat(ls, newConversion)

export function createConversionTrackerAction (tree, {company, workspace, folder, campaign}, conversionTracker) {
  return createConversionTracker(folder, conversionTracker, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaign', campaign],
      'details',
      'conversionTracker'
    ], push))
    .catch(pushResponseErrorToState(tree))
}
