import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'
import compact from 'lodash/compact'
import concat from 'lodash/concat'
import forEach from 'lodash/forEach'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import qs from 'query-string'

function loadReportEntities (level, id, config, queryParams) {
  const queryString = queryParams
    ? '?' + qs.stringify(queryParams)
    : ''

  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/report-entities${queryString}`, config)
}

export function loadReportEntitiesAction (tree, params, query = null) {
  const level = inferLevelFromParams(params)
  const {company, workspace, folder} = params

  function mergeNewEntities (entities, node) {
    const aux = {}

    forEach(entities, (value, name) => {
      aux[name] = node[name]
        ? concat(value, node[name])
        : value
    })

    return assign({}, node, aux)
  }

  const path = compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder]
  ])

  return loadReportEntities(level, params[level], getApiFetchConfig(tree), query)
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, mergeNewEntities))
    .catch(pushResponseErrorToState(tree))
}
