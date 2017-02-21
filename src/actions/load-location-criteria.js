import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import map from 'lodash/map'
import set from 'lodash/set'
import toLower from 'lodash/toLower'

function loadLocationCriteria (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/location-criteria/${id}`, config)
}

const register = {}

export function loadLocationCriteriaAction (tree, id) {
  register[id] = register[id] || loadLocationCriteria(id, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .then(function onSuccess (response) {
        delete register[id]

        tree.set(['locationCriteria', id], response.data)

        return response
      })
      .catch(pushResponseErrorToState(tree))

  return register[id]
}

const criterias = [
  'CityCriteriaId',
  'CountryCriteriaId',
  'MetroCriteriaId',
  'MostSpecificCriteriaId',
  'RegionCriteriaId'
].map(toLower)

function getCriteriaName (tree, id) {
  const cached = tree.get(['locationCriteria', id, 'name'])

  return cached || loadLocationCriteriaAction(tree, id)
      .then(response => response.data.name)
}

export function hydrateReportResult (tree, lines) {
  function hydrateLine (line) {
    function lookupName (criteria) {
      return line[criteria]
        ? getCriteriaName(tree, line[criteria]).then(name => set(line, criteria, name))
        : null
    }

    return Promise.all(map(criterias, lookupName))
      .then(() => line)
  }

  return Promise.all(map(lines, hydrateLine))
}
