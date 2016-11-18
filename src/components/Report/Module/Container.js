import React from 'react'
import assign from 'lodash/assign'
import some from 'lodash/some'
import filter from 'lodash/filter'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import keyBy from 'lodash/keyBy'
import reportEntityType from '../../../propTypes/report-entity'
import reportMetaDataType from '../../../propTypes/report-meta-data'
import moduleType from '../../../propTypes/report-module'
import Controller from './Controller'

const {PropTypes} = React

const ModuleContainer = React.createClass({
  displayName: 'Module-Container',
  propTypes: {
    editable: PropTypes.bool,
    module: moduleType.isRequired,
    metaData: reportMetaDataType.isRequired
  },
  contextTypes: {
    reportEntities: PropTypes.arrayOf(reportEntityType).isRequired
  },
  childContextTypes: {
    entities: PropTypes.object,
    activeOnly: PropTypes.bool,
    toggleActiveOnly: PropTypes.func
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
  getEntities () {
    const {reportEntities} = this.context
    const entities = keyBy(reportEntities, 'id')
    const {activeOnly} = this.state

    function filterByStatus (entity) {
      return activeOnly
        ? assign({}, entity, {list: filter(entity.list, 'status.is_active')})
        : entity
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
  toggleActiveOnly () {
    this.setState({
      activeOnly: !this.state.activeOnly
    })
  },
  render () {
    const {editable, metaData} = this.props
    const entities = this.getEntities()
    const module = assign({}, this.props.module)
    const filters = assign({}, module.filters)
    const entity = entities[module.entity]

    if (isEmpty(filters.id)) {
      filters.id = map(entity.list, 'id')
    }

    module.filters = filters

    return <Controller editable={editable} module={module} entity={entity} attributes={metaData.attributes}/>
  }
})

export default ModuleContainer
