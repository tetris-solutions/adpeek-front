import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import toLower from 'lodash/toLower'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'

function loadCriteriaName (ids, config) {
  return POST(`${process.env.ADPEEK_API_URL}/location-criteria`,
    assign({}, config, {body: ids}))
}

const onGoingCalls = {}

export function loadCriteriaNameAction (tree, ids) {
  function onSuccess (response) {
    tree.set('locationCriteria',
      assign({},
        response.data,
        tree.get('locationCriteria')))

    tree.commit()

    forEach(ids, id => {
      delete onGoingCalls[id]
    })

    return response
  }

  const promise = loadCriteriaName(ids, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(onSuccess)
    .catch(pushResponseErrorToState(tree))

  forEach(ids, id => {
    onGoingCalls[id] = promise
  })

  return promise
}

const criterias = [
  'CityCriteriaId',
  'CountryCriteriaId',
  'MetroCriteriaId',
  'MostSpecificCriteriaId',
  'RegionCriteriaId'
].map(toLower)

export function replaceCriteriaIdWithName (tree, lines) {
  const unknownIdsMap = {}
  const apiCalls = []
  const getLocationName = id => tree.get(['locationCriteria', id])

  const forEachCriteria = fn => forEach(criterias, criteria =>
    forEach(lines, line => fn(criteria, line)))

  function collectIds (criteria, line) {
    const id = line[criteria]

    if (!id || getLocationName(id)) {
      return
    }

    if (onGoingCalls[id]) {
      apiCalls.push(onGoingCalls[id])
    } else {
      unknownIdsMap[id] = true
    }
  }

  forEachCriteria(collectIds)

  const ids = keys(unknownIdsMap)

  if (!isEmpty(ids)) {
    apiCalls.push(loadCriteriaNameAction(tree, ids))
  }

  function replace (criteria, line) {
    const id = line[criteria]

    if (!id) return

    line[criteria] = getLocationName(id) || id
  }

  return Promise.all(apiCalls)
    .then(() => forEachCriteria(replace))
    .then(() => lines)
}
