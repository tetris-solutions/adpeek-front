import get from 'lodash/get'
import map from 'lodash/map'
import React from 'react'
import Module from './Module/Container'
import GridLayout from 'react-grid-layout'
import sizeMe from 'react-sizeme'
import {pure} from 'recompose'
import {derivative} from '../higher-order/branch'
import findIndex from 'lodash/findIndex'

let ModuleWrapper = props => (
  <Module {...props} metaData={get(props.metaData, props.module.entity)}/>
)

ModuleWrapper.displayName = 'Module-Wrapper'
ModuleWrapper.propTypes = {
  metaData: React.PropTypes.object.isRequired,
  module: React.PropTypes.object.isRequired
}

ModuleWrapper = derivative(
  'report',
  'module',
  ({modules}, {id}) => ['modules', findIndex(modules, {id})],
  ModuleWrapper
)

const Grid_ = ({
  modules,
  onLayoutChange,
  cloneModule,
  editMode,
  layout,
  params,
  dispatch,
  metaData,
  openModule,
  width
}) => (
  <GridLayout layout={layout} width={width} rowHeight={100} onLayoutChange={onLayoutChange}>
    {map(modules, ({id, type}, index) =>
      <div key={id} data-module-id={id} data-module-type={type}>
        <ModuleWrapper
          id={id}
          editable={editMode}
          clone={cloneModule}
          metaData={metaData}
          editMode={openModule === id}/>
      </div>)}
  </GridLayout>
)

Grid_.displayName = 'Pure-Grid'
Grid_.propTypes = {
  modules: React.PropTypes.array.isRequired,
  cloneModule: React.PropTypes.func.isRequired,
  onLayoutChange: React.PropTypes.func.isRequired,
  layout: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  metaData: React.PropTypes.object.isRequired,
  editMode: React.PropTypes.bool,
  openModule: React.PropTypes.string,
  width: React.PropTypes.number
}

const ReportGrid = pure(Grid_)
const DynamicGrid = props => <ReportGrid width={props.size.width} {...props}/>

DynamicGrid.propTypes = {
  size: React.PropTypes.shape({
    width: React.PropTypes.number
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
