import React from 'react'
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
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import keyBy from 'lodash/keyBy'
import reportEntityType from '../../../propTypes/report-entity'
import reportMetaDataType from '../../../propTypes/report-meta-data'
import moduleType from '../../../propTypes/report-module'
import Controller from './Controller'
import {pure} from 'recompose'
import log from 'loglevel'

const keyed = reportEntities => keyBy(reportEntities, 'id')

const ModuleContainer = React.createClass({
  displayName: 'Module-Container',
  propTypes: {
    editable: React.PropTypes.bool,
    module: moduleType.isRequired,
    metaData: reportMetaDataType.isRequired,
    reportEntities: React.PropTypes.arrayOf(reportEntityType).isRequired
  },
  childContextTypes: {
    entities: React.PropTypes.object,
    activeOnly: React.PropTypes.bool,
    toggleActiveOnly: React.PropTypes.func
  },
  getInitialState () {
    return {
      activeOnly: true
    }
  },
  getChildContext () {
    return {
      entities: this.getEntities(),
      activeOnly: this.state.activeOnly,
      toggleActiveOnly: this.toggleActiveOnly
    }
  },
  calculateEntities ({entities, moduleEntity, selectedIds, activeOnly}) {
    log.info(`will mount ${this.props.module.name} entities`)

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
      case 'Search':
      case 'Audience':
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

    if (entities.AdSet) {
      entities.AdSet = filterByParent(entities.AdSet, entities.Campaign, 'campaign_id')
    }

    if (entities.Search) {
      entities.Search = filterByParent(entities.Search, entities.Campaign, 'campaign_id')
    }

    if (entities.Audience) {
      entities.Audience = filterByParent(entities.Audience, entities.Campaign, 'campaign_id')
    }

    if (entities.AdGroup) {
      entities.AdGroup = filterByParent(entities.AdGroup, entities.Campaign, 'campaign_id')
    }

    if (entities.Ad) {
      entities.Ad = entities.AdSet
        ? filterByParent(entities.Ad, entities.AdSet, 'adset_id')
        : filterByParent(entities.Ad, entities.AdGroup, 'adgroup_id')
    }

    if (entities.Keyword) {
      entities.Keyword = filterByParent(entities.Keyword, entities.AdGroup, 'adgroup_id')
    }

    return entities
  },
  entitiesSource () {
    const {activeOnly} = this.state
    const {module, reportEntities} = this.props

    return {
      reportEntities,
      activeOnly,
      moduleEntity: module.entity,
      selectedIds: module.filters.id
    }
  },
  getEntities () {
    const newSource = this.entitiesSource()
    const anyChange = !this._source || (
        this._source.reportEntities !== newSource.reportEntities ||
        this._source.activeOnly !== newSource.activeOnly ||
        this._source.selectedIds !== newSource.selectedIds ||
        this._source.moduleEntity !== newSource.moduleEntity
      )

    if (anyChange) {
      newSource.entities = keyed(newSource.reportEntities)

      this._source = newSource
      this._entities = this.calculateEntities(this._source)
    }

    return this._entities
  },
  toggleActiveOnly () {
    this.setState({
      activeOnly: !this.state.activeOnly
    })
  },
  render () {
    const {metaData: {attributes}} = this.props
    const entities = this.getEntities()
    const module = assign({}, this.props.module)
    const filters = assign({}, module.filters)
    const entity = entities[module.entity]

    if (isEmpty(filters.id)) {
      filters.id = map(entity.list, 'id')
    }

    module.filters = filters

    return <Controller {...this.props} module={module} entity={entity} attributes={attributes}/>
  }
})

const Module_ = props => <ModuleContainer {...props}/>
Module_.displayName = 'Pure-Module'

const HardModule = pure(Module_)

const Upper = (props, {reportEntities}) => <HardModule {...props} reportEntities={reportEntities}/>

Upper.contextTypes = {
  reportEntities: React.PropTypes.arrayOf(reportEntityType).isRequired
}

export default Upper
