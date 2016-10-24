import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import qs from 'query-string'
import camelCase from 'lodash/camelCase'

function loadRecent (level, params, config) {
  return GET(`${process.env.ADPEEK_API_URL}/recent/${level}?${qs.stringify(params)}`, config)
}

export function loadRecentAction (tree, level, params, token) {
  const {company, workspace, folder, campaign, order, report} = params

  const path = compact([
    'user',
    company && ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    campaign && ['campaigns', campaign],
    order && ['orders', order],
    report && ['reports', report],
    camelCase(`recent ${level}`)
  ])

  return loadRecent(level, params, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path))
    .catch(pushResponseErrorToState(tree))
}
