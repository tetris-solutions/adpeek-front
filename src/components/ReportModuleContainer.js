import React from 'react'
import assign from 'lodash/assign'
import find from 'lodash/find'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import reportEntityType from '../propTypes/report-entity'
import moduleType from '../propTypes/report-module'
import ReportModuleController from './ReportModuleController'

const {PropTypes} = React

function ReportModuleContainer (props) {
  const module = assign({}, props.module)
  const filters = assign({}, module.filters)
  const entity = find(props.entities, {id: module.entity})

  if (isEmpty(filters.id)) {
    filters.id = map(entity.list, 'id')
  }

  module.filters = filters

  return <ReportModuleController {...props} module={module} entity={entity}/>
}

ReportModuleContainer.displayName = 'Report-Module-Container'
ReportModuleContainer.propTypes = {
  module: moduleType,
  entities: PropTypes.arrayOf(reportEntityType).isRequired
}

export default ReportModuleContainer
