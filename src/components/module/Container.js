import React from 'react'
import PropTypes from 'prop-types'
import assign from 'lodash/assign'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import keyBy from 'lodash/keyBy'
import reportEntityType from '../../propTypes/report-entity'
import reportMetaDataType from '../../propTypes/report-meta-data'
import moduleType from '../../propTypes/report-module'
import Controller from './Controller'
import log from 'loglevel'
import {mountModuleEntities} from '../../functions/mount-module-entities'

const keyed = reportEntities => keyBy(reportEntities, 'id')

class ModuleContainer extends React.Component {
  static displayName = 'Module-Container'

  static propTypes = {
    editable: PropTypes.bool,
    module: moduleType.isRequired,
    metaData: reportMetaDataType.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired
  }

  static childContextTypes = {
    activeOnly: PropTypes.bool,
    toggleActiveOnly: PropTypes.func
  }

  state = {
    activeOnly: false
  }

  getChildContext () {
    return {
      activeOnly: this.state.activeOnly,
      toggleActiveOnly: this.toggleActiveOnly
    }
  }

  calculateEntities = ({entities, moduleEntity, selectedIds, activeOnly}) => {
    log.info(`will mount ${this.props.module.name} entities`)

    return mountModuleEntities(entities, moduleEntity, selectedIds, activeOnly)
  }

  entitiesSource = () => {
    const {activeOnly} = this.state
    const {module, entities} = this.props

    return {
      entities,
      activeOnly,
      moduleEntity: module.entity,
      selectedIds: module.filters.id
    }
  }

  getEntities = () => {
    const newSource = this.entitiesSource()

    newSource.entities = keyed(newSource.entities)

    return this.calculateEntities(newSource)
  }

  toggleActiveOnly = () => {
    this.setState({
      activeOnly: !this.state.activeOnly
    })
  }

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

    return (
      <Controller
        {...this.props}
        entities={entities}
        module={module}
        entity={entity}
        attributes={attributes}/>
    )
  }
}

export default ModuleContainer
