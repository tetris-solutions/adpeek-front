import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'
import compact from 'lodash/compact'
import uniqBy from 'lodash/uniqBy'
import map from 'lodash/map'
import get from 'lodash/get'
import concat from 'lodash/concat'
import {statusResolver} from '../functions/status-resolver'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import trim from 'lodash/trim'

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

function loadReportEntity (level, id, entity, body, config) {
  return POST(`${process.env.ADPEEK_API_URL}/${level}/${id}/list-entities/${entity}`,
    assign({body}, config))
}

const entityListName = {
  Campaign: 'campaigns',
  Ad: 'ads',
  AdGroup: 'adGroups',
  AdSet: 'adSets',
  Video: 'videos',
  Keyword: 'keywords',
  Strategy: 'strategies',
  Partition: 'partitions',
  Product: 'products'
}

function dispatchAction (tree, params, query, entity) {
  const level = inferLevelFromParams(params)
  const {company, workspace, folder} = params
  const setStatus = statusResolver(tree.get('statuses'))

  function mergeNewEntities (entityArray, entityMap) {
    const concatWithoutDuplicates = newList => uniqBy(concat(
      map(newList, normalize),
      get(entityMap, entityListName[entity], [])
    ), 'id')

    if (entity === 'Campaign') {
      entityArray = map(entityArray, setStatus)
    }

    return assign({}, entityMap, {
      [entityListName[entity]]: concatWithoutDuplicates(entityArray)
    })
  }

  const path = compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    'entities'
  ])

  return loadReportEntity(level, params[level], entity, query, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, mergeNewEntities))
    .catch(pushResponseErrorToState(tree))
}

const byPlatformCalls = {}

export function loadReportEntityAction (tree, params, query, entity) {
  if (entity === 'Account') {
    return Promise.resolve()
  }

  const call = () => dispatchAction(tree, params, query, entity)

  if (byPlatformCalls[query.platform]) {
    byPlatformCalls[query.platform] = byPlatformCalls[query.platform].then(call, call)
  } else {
    byPlatformCalls[query.platform] = call()
  }

  return byPlatformCalls[query.platform]
}
