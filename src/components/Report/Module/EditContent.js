import React from 'react'
import Input from '../../Input'
import SelectedFields from './SelectedFields'
import Select from '../../Select'
import TypeSelect from './TypeSelect'
import _ReportChart from '../Chart/Container'
import {expandVertically} from '../../higher-order/expand-vertically'
import map from 'lodash/map'

const ReportChart = expandVertically(_ReportChart)

const {PropTypes} = React

const EditContent = ({entities, draftModule, onChangeInput, metaData, update, removeItem, reportParams, draftEntity, savedEntity, savedModule}) => (
  <section style={{height: '80vh', overflowY: 'auto'}}>
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--4-col'>
        <Input name='name' label='name' defaultValue={draftModule.name} onChange={onChangeInput} required/>
      </div>

      <div className='mdl-cell mdl-cell--4-col'>
        <Select label='entity' name='entity' onChange={onChangeInput} value={draftEntity.id}>
          {map(entities, ({id, name}) =>
            <option key={id} value={id}>
              {name}
            </option>)}
        </Select>
      </div>

      <div className='mdl-cell mdl-cell--4-col'>
        <TypeSelect onChange={onChangeInput} value={draftModule.type}/>
      </div>

      <SelectedFields
        dimensions={draftModule.dimensions}
        metrics={draftModule.metrics}
        sort={draftModule.sort}
        attributes={metaData.attributes}
        save={update}
        remove={removeItem}/>
    </div>

    <ReportChart
      save={update}
      metaData={metaData}
      module={savedModule}
      entity={savedEntity}
      reportParams={reportParams}/>
  </section>
)

EditContent.displayName = 'Edit-Content'
EditContent.propTypes = {
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

export default EditContent
