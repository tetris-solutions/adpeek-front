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
import {mountModuleEntities} from '../../functions/mount-module-entities'
import {createTask} from '../../functions/queue-hard-lift'
import filter from 'lodash/filter'

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
    activeOnly: false,
    setup: null
  }

  getChildContext () {
    return {
      activeOnly: this.state.activeOnly,
      toggleActiveOnly: this.toggleActiveOnly
    }
  }

  componentWillMount () {
    this.getSetup()
      .then(setup => this.setState({setup}))
  }

  componentWillReceiveProps (nextProps) {
    this.getSetup(nextProps)
      .then(setup => this.setState({setup}))
  }

  getEntities = () => {
    const {activeOnly} = this.state
    const {module, entities} = this.props

    return mountModuleEntities(keyBy(entities, 'id'), module.entity, module.filters.id, activeOnly)
  }

  toggleActiveOnly = () => {
    this.setState({
      activeOnly: !this.state.activeOnly
    })
  }

  attributeExists = (name) => {
    return Boolean(this.props.metaData.attributes[name])
  }

  mountSetup = createTask((entities, props) => {
    const {metaData: {attributes}} = props
    const module = assign({}, props.module)
    const filters = assign({}, module.filters)
    const entity = entities[module.entity]

    module.dimensions = filter(module.dimensions, this.attributeExists)
    module.metrics = filter(module.metrics, this.attributeExists)

    if (module.type === 'total') {
      module.dimensions = []
    }

    if (isEmpty(filters.id)) {
      filters.id = map(entity.list, 'id')
    }

    module.filters = filters

    return (assign({}, props, {entities, module, attributes, entity}))
  })

  getSetup = (props = this.props) => {
    return this.getEntities()
      .then(entities =>
        this.mountSetup(entities, props))
  }

  render () {
    if (!this.state.setup) return null

    return (
      <Controller {...this.state.setup}/>
    )
  }
}

export default ModuleContainer
