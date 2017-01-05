import get from 'lodash/get'
import map from 'lodash/map'
import React from 'react'
import Module from './Module/Container'
import GridLayout from 'react-grid-layout'
import sizeMe from 'react-sizeme'
import {pure} from 'recompose'

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
    {map(modules, (module, index) =>
      <div key={module.id} data-module-id={module.id} data-module-type={module.type}>
        <Module
          params={params}
          dispatch={dispatch}
          module={module}
          editable={editMode}
          metaData={get(metaData, module.entity)}
          clone={cloneModule}
          editMode={openModule === module.id}/>
      </div>)}
  </GridLayout>
)

Grid_.displayName = 'Pure-Grid'
Grid_.propTypes = {
  modules: React.PropTypes.object.isRequired,
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
