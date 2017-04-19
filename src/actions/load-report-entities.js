import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
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

function loadReportEntities (level, id, queryParams, config) {
  const queryString = queryParams
    ? '?' + qs.stringify(queryParams)
    : ''

  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/report-entities${queryString}`, config)
}

function loadReportEntity (level, id, entity, queryParams, config) {
  const queryString = queryParams
    ? '?' + qs.stringify(queryParams)
    : ''

  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/entity/${entity}${queryString}`, config)
}

const entityListName = {
  Campaign: 'campaigns',
  Ad: 'ads',
  AdGroup: 'adGroups',
  AdSet: 'adSets',
  Videos: 'video',
  Keyword: 'keywords'
}

function dispatchAction (tree, params, query, entity) {
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

  function mergeNewEntities (newEntities, oldEntities) {
    if (entity) {
      newEntities = {[entityListName[entity]]: newEntities}
    }

    newEntities.campaigns = map(newEntities.campaigns, setStatus)

    forEach(newEntities, (newList, entityName) => {
      newEntities[entityName] = uniqBy(concat(
        map(newList, normalize),
        get(oldEntities, entityName, [])
      ), 'id')
    })

    return newEntities
  }

  const path = compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    'entities'
  ])

  const promise = entity
    ? loadReportEntity(level, params[level], entity, query, getApiFetchConfig(tree))
    : loadReportEntities(level, params[level], query, getApiFetchConfig(tree))

  return promise
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, mergeNewEntities))
    .catch(pushResponseErrorToState(tree))
}

const byPlatformCalls = {}

export function loadReportEntitiesAction (tree, params, query, entity = null) {
  const call = () => dispatchAction(tree, params, query, entity)

  if (byPlatformCalls[query.platform]) {
    byPlatformCalls[query.platform] = byPlatformCalls[query.platform].then(call, call)
  } else {
    byPlatformCalls[query.platform] = call()
  }

  return byPlatformCalls[query.platform]
}
