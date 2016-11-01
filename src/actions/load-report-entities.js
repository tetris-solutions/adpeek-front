import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'
import compact from 'lodash/compact'
import uniqBy from 'lodash/uniqBy'
import map from 'lodash/map'
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import concat from 'lodash/concat'
import {statusResolver} from '../functions/status-resolver'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import qs from 'query-string'
import trim from 'lodash/trim'

function loadReportEntities (level, id, config, queryParams) {
  const queryString = queryParams
    ? '?' + qs.stringify(queryParams)
    : ''

  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/report-entities${queryString}`, config)
}

function _loadReportEntitiesAction (tree, params, query) {
  const level = inferLevelFromParams(params)
  const {company, workspace, folder} = params
  const setStatus = statusResolver(tree.get('statuses'))

  function normalize (item) {
    if (item.description_1) {
      item.description = (
        trim(item.description_1) + ' ' +
        trim(item.description_2)
      )
    }

    if (item.headline_part_1) {
      item.headline = (
        trim(item.headline_part_1) + ' ' +
        trim(item.headline_part_2)
      )
    }

    return item
  }

  function mergeNewEntities (entities, node) {
    entities.campaigns = map(entities.campaigns, setStatus)

    forEach(entities, (localList, name) => {
      entities[name] = uniqBy(concat(
        get(node, `entities.${name}`, []),
        map(localList, normalize)
      ), 'id')
    })

    return assign({}, node, {entities})
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

const byPlatformCalls = {}

export function loadReportEntitiesAction (tree, params, query) {
  const call = () => _loadReportEntitiesAction(tree, params, query)

  if (byPlatformCalls[query.platform]) {
    byPlatformCalls[query.platform] = byPlatformCalls[query.platform].then(call, call)
  } else {
    byPlatformCalls[query.platform] = call()
  }

  return byPlatformCalls[query.platform]
}
