import React from 'react'
import Input from './Input'
import Fields from './ReportModuleEditFields'
import Select from './Select'
import TypeSelect from './ReportModuleEditTypeSelect'
import _ReportChart from './ReportModuleChart'
import {expandVertically} from './higher-order/expand-vertically'
import map from 'lodash/map'

const ReportChart = expandVertically(_ReportChart)

const {PropTypes} = React

const ReportModuleEditPreview = props => (
  <section style={{height: '80vh', overflowY: 'auto'}}>
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--4-col'>
        <Input name='name' label='name' defaultValue={props.draftModule.name} onChange={props.onChangeInput} required/>
      </div>

      <div className='mdl-cell mdl-cell--4-col'>
        <Select label='entity' name='entity' onChange={props.onChangeInput} value={props.draftEntity.id}>
          {map(props.entities, ({id, name}) =>
            <option key={id} value={id}>
              {name}
            </option>)}
        </Select>
      </div>

      <div className='mdl-cell mdl-cell--4-col'>
        <TypeSelect onChange={props.onChangeInput} value={props.draftModule.type}/>
      </div>

      <Fields
        module={props.draftModule}
        attributes={props.metaData.attributes}
        save={props.update}
        remove={props.removeItem}/>
    </div>

    <ReportChart
      save={props.update}
      metaData={props.metaData}
      module={props.savedModule}
      entity={props.savedEntity}
      reportParams={props.reportParams}/>
  </section>
)

ReportModuleEditPreview.displayName = 'Edit-Preview'
ReportModuleEditPreview.propTypes = {
  update: PropTypes.func.isRequired,
  entities: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  onChangeInput: PropTypes.func.isRequired,
  metaData: PropTypes.object.isRequired,
  savedModule: PropTypes.object.isRequired,
  savedEntity: PropTypes.object.isRequired,
  draftModule: PropTypes.object.isRequired,
  draftEntity: PropTypes.object.isRequired,
  reportParams: PropTypes.object.isRequired
}

export default ReportModuleEditPreview
