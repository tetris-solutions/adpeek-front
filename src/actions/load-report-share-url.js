import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import compact from 'lodash/compact'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'

function loadReportShareUrl (level, entityId, report, from, to, config) {
  return GET(`${process.env.ADPEEK_API_URL}/${level}/${entityId}/share/report/${report}?from=${from}&to=${to}`, config)
}

export function loadReportShareUrlAction (tree, params, report, {from, to}) {
  const level = inferLevelFromParams(params)
  const path = compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', report]
  ])

  const saveUrl = ({url: shareUrl}, report) => assign({}, report, {shareUrl})

  return loadReportShareUrl(level, params[level], report, from, to, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, saveUrl))
    .catch(pushResponseErrorToState(tree))
}
