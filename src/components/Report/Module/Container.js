import React from 'react'
import assign from 'lodash/assign'
import some from 'lodash/some'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
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
  calculateEntities ({entities, moduleEntity, moduleIds, activeOnly}) {
    log.info(`will mount ${this.props.module.name} entities`)

    function filterByStatus (entity) {
      if (activeOnly) {
        const whiteList = moduleEntity === entity.id
          ? moduleIds
          : []

        entity = assign({}, entity)
        entity.list = filter(entity.list, ({status, id}) => (
          status.is_active || includes(whiteList, id)
        ))
      }
      return entity
    }

    function filterByParent (entity, parent, parentIdAtribute) {
      return assign({}, entity, {
        list: filter(entity.list, item => some(parent.list, {id: item[parentIdAtribute]}))
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
      moduleIds: module.filters.id
    }
  },
  getEntities () {
    const newSource = this.entitiesSource()
    const anyChange = !this._source || (
        this._source.reportEntities !== newSource.reportEntities ||
        this._source.activeOnly !== newSource.activeOnly ||
        this._source.moduleIds !== newSource.moduleIds ||
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
