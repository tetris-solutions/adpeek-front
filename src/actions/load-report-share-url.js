import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import compact from 'lodash/compact'
import {saveResponseData} from '../functions/save-response-data'

function loadReportShareUrl (level, entityId, report, config) {
  return GET(`${process.env.ADPEEK_API_URL}/${level}/${entityId}/share/report/${report}`, config)
}

export function loadReportShareUrlAction (tree, params, report, {from, to}) {
  const level = inferLevelFromParams(params)
  const path = compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', report],
    'shareUrl'
  ])

  const saveUrl = ({url}) => `${url}&from=${from}&to=${to}`

  return loadReportShareUrl(level, params[level], report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, saveUrl))
    .catch(pushResponseErrorToState(tree))
}
