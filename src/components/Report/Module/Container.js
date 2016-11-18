import React from 'react'
import assign from 'lodash/assign'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
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
    entities: PropTypes.arrayOf(reportEntityType),
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
    const {activeOnly} = this.state

    function prepare (entity) {
      return entity.id === 'Campaign' && activeOnly
        ? assign({}, entity, {list: filter(entity.list, 'status.is_active')})
        : entity
    }

    return map(this.context.reportEntities, prepare)
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
    const entity = find(entities, {id: module.entity})

    if (isEmpty(filters.id)) {
      filters.id = map(entity.list, 'id')
    }

    module.filters = filters

    return <Controller editable={editable} module={module} entity={entity} attributes={metaData.attributes}/>
  }
})

export default ModuleContainer
