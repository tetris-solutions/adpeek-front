import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

function createReport (level, id, report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/${level}/${id}/report`,
    assign({body: report}, config))
}

export function createReportAction (tree, params, report) {
  const level = inferLevelFromParams(params)

  return createReport(level, params[level], report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
