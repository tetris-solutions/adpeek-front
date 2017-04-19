import prop from 'lodash/property'
import assign from 'lodash/assign'
import some from 'lodash/some'
import identity from 'lodash/identity'
import memoize from 'lodash/memoize'
import find from 'lodash/find'
import toLower from 'lodash/toLower'
import countBy from 'lodash/countBy'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'

/**
 *
 * @param {Object} entities list of all available report entities
 * @param {String} moduleEntity current module entity
 * @param {Array} selectedIds array of selected ids
 * @param {Boolean} activeOnly whether active only mode is on
 * @returns {Object} structured entity map
 */
export function mountModuleEntities (entities, moduleEntity, selectedIds, activeOnly) {
  const adGroupLevel = entities.AdSet ? 'AdSet' : 'AdGroup'
  const search = {}

  forEach(entities, ({id, list}) => {
    search[toLower(id)] = memoize(id => find(list, {id}))
  })

  const reference = (entityName, callback, getId = identity) =>
    item => callback(
      search[entityName](getId(item))
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

  const toCampaignId = (...nodes) => climbTree(nodes, true)

  let isSelected

  switch (moduleEntity) {
    case 'AdSet':
    case 'AdGroup':
    case 'Video':
    case 'Search':
    case 'Audience':
    case 'Location':
      isSelected = countBy(selectedIds, toCampaignId(toLower(moduleEntity), 'campaign'))
      break
    case 'Ad':
    case 'Keyword':
      isSelected = countBy(selectedIds, toCampaignId(toLower(moduleEntity), toLower(adGroupLevel), 'campaign'))
      break
    default:
      isSelected = countBy(selectedIds, identity)
  }

  function filterByStatus (entity) {
    if (activeOnly) {
      entity = assign({}, entity)
      entity.list = filter(entity.list, ({status, id}) => (
        Boolean(isSelected[id]) || status.is_active
      ))
    }
    return entity
  }

  function filterByParent (entity, parent, parentIdAtribute) {
    const hasActiveParent = item => some(parent.list, {id: item[parentIdAtribute]})

    return assign({}, entity, {
      list: filter(entity.list, hasActiveParent)
    })
  }

  if (entities.Placement) {
    entities.Placement = filterByStatus(entities.Placement)
  }

  entities.Campaign = filterByStatus(entities.Campaign)

  forEach(['AdGroup', 'AdSet', 'Search', 'Audience', 'Video', 'Location'], level => {
    if (entities[level]) {
      entities[level] = filterByParent(entities[level], entities.Campaign, 'campaign_id')
    }
  })

  if (entities.Ad) {
    entities.Ad = entities.AdSet
      ? filterByParent(entities.Ad, entities.AdSet, 'adset_id')
      : filterByParent(entities.Ad, entities.AdGroup, 'adgroup_id')
  }

  if (entities.Keyword) {
    entities.Keyword = filterByParent(entities.Keyword, entities.AdGroup, 'adgroup_id')
  }

  return entities
}
