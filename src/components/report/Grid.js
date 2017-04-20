import get from 'lodash/get'
import map from 'lodash/map'
import React from 'react'
import PropTypes from 'prop-types'
import Module from '../module/Container'
import GridLayout from 'react-grid-layout'
import sizeMe from 'react-sizeme'
import {derivative} from '../higher-order/branch'
import findIndex from 'lodash/findIndex'

let ModuleWrapper = props => (
  <Module {...props} metaData={get(props.metaData, props.module.entity)}/>
)

ModuleWrapper.displayName = 'Module-Wrapper'
ModuleWrapper.propTypes = {
  metaData: PropTypes.object.isRequired,
  module: PropTypes.object.isRequired
}

ModuleWrapper = derivative(
  'report',
  'module',
  ({modules}, {id}) => ['modules', findIndex(modules, {id})],
  ModuleWrapper
)

const ReportGrid = ({modules, onLayoutChange, loadEntity, cloneModule, editMode, layout, params, dispatch, metaData, openModule, width}) => (
  <GridLayout layout={layout} width={width} rowHeight={100} onLayoutChange={onLayoutChange}>
    {map(modules, ({id, type}, index) =>
      <div key={id} data-module-id={id} data-module-type={type}>
        <ModuleWrapper
          id={id}
          editable={editMode}
          clone={cloneModule}
          loadEntity={loadEntity}
          metaData={metaData}
          editMode={openModule === id}/>
      </div>)}
  </GridLayout>
)

ReportGrid.displayName = 'Pure-Grid'
ReportGrid.propTypes = {
  loadEntity: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired,
  cloneModule: PropTypes.func.isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  layout: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  metaData: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
  openModule: PropTypes.string,
  width: PropTypes.number
}

const DynamicGrid = props => <ReportGrid width={props.size.width} {...props}/>

DynamicGrid.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number
  })
}

DynamicGrid.displayName = 'Dynamic-Grid'

const WrappedGrid = sizeMe({
  refreshMode: 'debounce'
})(DynamicGrid)

const HardGrid = props => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--12-col'>
      <WrappedGrid {...props}/>
    </div>
  </div>
)

HardGrid.displayName = 'Hard-Grid'

export default HardGrid
