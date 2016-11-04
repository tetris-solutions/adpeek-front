import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

function setDefaultReport (level, id, report, favorite, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/${level}/${id}/report/${report}${favorite ? '/favorite' : '/default'}`,
    assign({body: {}}, config))
}

export function setDefaultReportAction (tree, params, report, favorite = false) {
  const level = inferLevelFromParams(params)
  return setDefaultReport(level, params[level], report, favorite, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
