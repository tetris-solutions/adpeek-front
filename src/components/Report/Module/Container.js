import React from 'react'
import assign from 'lodash/assign'
import find from 'lodash/find'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import reportEntityType from '../../../propTypes/report-entity'
import moduleType from '../../../propTypes/report-module'
import Controller from './Controller'

const {PropTypes} = React

function ModuleContainer (props) {
  const module = assign({}, props.module)
  const filters = assign({}, module.filters)
  const entity = find(props.entities, {id: module.entity})

  if (isEmpty(filters.id)) {
    filters.id = map(entity.list, 'id')
  }

  module.filters = filters

  return <Controller {...props} module={module} entity={entity}/>
}

ModuleContainer.displayName = 'Module-Container'
ModuleContainer.propTypes = {
  module: moduleType,
  entities: PropTypes.arrayOf(reportEntityType).isRequired
}

export default ModuleContainer
