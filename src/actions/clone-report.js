import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

function cloneReport (level, id, report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/${level}/${id}/report/${report.id}/clone`,
    assign({body: report}, config))
}

export function cloneReportAction (tree, params, report) {
  const level = inferLevelFromParams(params)

  return cloneReport(level, params[level], report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
