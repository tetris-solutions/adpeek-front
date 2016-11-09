import React from 'react'
import assign from 'lodash/assign'
import find from 'lodash/find'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import reportEntityType from '../../../propTypes/report-entity'
import reportMetaDataType from '../../../propTypes/report-meta-data'
import moduleType from '../../../propTypes/report-module'
import Controller from './Controller'

const {PropTypes} = React

function ModuleContainer ({editable, module, metaData}, {entities}) {
  module = assign({}, module)

  const filters = assign({}, module.filters)
  const entity = find(entities, {id: module.entity})

  if (isEmpty(filters.id)) {
    filters.id = map(entity.list, 'id')
  }

  module.filters = filters

  return <Controller editable={editable} module={module} entity={entity} attributes={metaData.attributes}/>
}

ModuleContainer.displayName = 'Module-Container'
ModuleContainer.propTypes = {
  editable: PropTypes.bool.isRequired,
  module: moduleType.isRequired,
  metaData: reportMetaDataType.isRequired
}
ModuleContainer.contextTypes = {
  entities: PropTypes.arrayOf(reportEntityType).isRequired
}

export default ModuleContainer
