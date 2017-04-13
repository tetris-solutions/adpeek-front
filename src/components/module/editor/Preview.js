import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../Input'
import SelectedFields from './SelectedFields'
import Select from '../../Select'
import TypeSelect from './TypeSelect'
import _ReportChart from '../chart/Chart'
import {expandVertically} from '../../higher-order/expand-vertically'
import map from 'lodash/map'

const ReportChart = expandVertically(_ReportChart)

const EditContent = (props, {report, entities, onChangeName, onChangeType, onChangeEntity, change, draft: {module, entity}}) => (
  <section style={{height: '80vh', overflowY: 'auto'}}>
    <div className='mdl-grid'>
      <div className={`mdl-cell mdl-cell--${report.platform === 'analytics' ? 7 : 4}-col`}>
        <Input name='name' label='name' defaultValue={module.name} onChange={onChangeName} required/>
      </div>

      {report.platform !== 'analytics' && (
        <div className='mdl-cell mdl-cell--4-col'>
          <Select label='entity' name='entity' onChange={onChangeEntity} value={entity.id}>
            {map(entities, ({id, name}) =>
              <option key={id} value={id}>
                {name}
              </option>)}
          </Select>
        </div>)}

      <div className={`mdl-cell mdl-cell--${report.platform === 'analytics' ? 5 : 4}-col`}>
        <TypeSelect onChange={onChangeType} value={module.type}/>
      </div>

      <SelectedFields
        dimensions={module.dimensions}
        metrics={module.metrics}
        sort={module.sort}
        attributes={module.attributes}
        save={change}
        remove={module}/>
    </div>

    <ReportChart change={change}/>
  </section>
)

EditContent.displayName = 'Edit-Content'
EditContent.contextTypes = {
  report: PropTypes.object,
  onChangeName: PropTypes.func.isRequired,
  onChangeEntity: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  entities: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  draft: PropTypes.object.isRequired
}

export default EditContent
