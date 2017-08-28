import prop from 'lodash/property'
import keyBy from 'lodash/keyBy'
import set from 'lodash/set'
import assign from 'lodash/assign'
import some from 'lodash/some'
import identity from 'lodash/identity'
import toLower from 'lodash/toLower'
import countBy from 'lodash/countBy'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import {getCanonicalReportEntity} from './get-canonical-report-entity'
import {createTask} from './queue-hard-lift'

/**
 *
 * @param {Object} entities list of all available report entities
 * @param {String} moduleEntity current module entity
 * @param {Array} selectedIds array of selected ids
 * @param {Boolean} activeOnly whether active only mode is on
 * @returns {Promise.<Object>} structured entity map
 */
export const mountModuleEntities = createTask((entities, moduleEntity, selectedIds, activeOnly) => {
  const adGroupLevel = entities.AdSet ? 'AdSet' : 'AdGroup'
  const index = {}

  forEach(entities, ({id, list}) => {
    index[toLower(id)] = keyBy(list, id)
  })

  const reference = (entityName, callback, getId = identity) =>
    item => callback(
      index[entityName][getId(item)]
    )

  function climbTree (nodes, first = true) {
    if (!nodes[0]) {
      return prop('id')
    }

    const name = nodes[0]

    return reference(name,
      climbTree(nodes.slice(1), false),
      first ? undefined : prop(name + '_id')
    )
  }

  const toCampaignId = createTask((...nodes) => climbTree(nodes, true))

  let selectedItems

  function getSelection () {
    let promise

    switch (getCanonicalReportEntity(moduleEntity)) {
      case 'AdSet':
      case 'AdGroup':
        promise = toCampaignId(toLower(moduleEntity), 'campaign')
        break
      case 'Ad':
      case 'Keyword':
        promise = toCampaignId(toLower(moduleEntity), toLower(adGroupLevel), 'campaign')
        break
      default:
        promise = Promise.resolve(identity)
    }

    return promise.then(fn => countBy(selectedIds, fn))
  }

  const filterByStatus = createTask(entity => {
    if (activeOnly) {
      entity = assign({}, entity)
      entity.list = filter(entity.list, ({status, id}) => (
        Boolean(selectedItems[id]) || status.is_active
      ))
    }
    return entity
  })

  const filterByParent = createTask((entity, parent, parentIdAtribute) => {
    const hasActiveParent = item => some(parent.list, {id: item[parentIdAtribute]})

    return assign({}, entity, {
      list: filter(entity.list, hasActiveParent)
    })
  })

  const setEntity = name => value => set(entities, name, value)

  const setRootEntity = (name, always = false) => () =>
    entities[name] || always
      ? filterByStatus(entities[name]).then(setEntity(name))
      : null

  const setChildEntity = (name, parent) => () =>
    entities[name]
      ? filterByParent(entities[name], entities[parent], `${toLower(parent)}_id`)
        .then(setEntity(name))
      : null

  const adGroupEntityName = entities.AdGroup ? 'AdGroup' : 'AdSet'

  return getSelection()
    .then(selection => {
      selectedIds = selection
    })
    .then(setRootEntity('Placement'))
    .then(setRootEntity('Strategy'))
    .then(setRootEntity('Campaign', true))
    .then(setChildEntity(adGroupEntityName, 'Campaign'))
    .then(setChildEntity('Search', 'Campaign'))
    .then(setChildEntity('Video', 'Campaign'))
    .then(setChildEntity('Location', 'Campaign'))
    .then(setChildEntity('Category', 'Campaign'))
    .then(setChildEntity('Query', 'Campaign'))
    .then(setChildEntity('Product', 'Campaign'))
    .then(setChildEntity('Ad', adGroupEntityName))
    .then(setChildEntity('Keyword', adGroupEntityName))
    .then(setChildEntity('Partition', adGroupEntityName))
    .then(setChildEntity('Audience', adGroupEntityName))
    .then(() => entities)
})
