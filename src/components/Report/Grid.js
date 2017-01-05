import get from 'lodash/get'
import map from 'lodash/map'
import React from 'react'
import Module from './Module/Container'
import GridLayout from 'react-grid-layout'
import sizeMe from 'react-sizeme'

const Grid = sizeMe()(props => <GridLayout width={props.size.width} {...props}/>)

class ReportGrid extends React.PureComponent {
  render () {
    const {
      modules,
      onLayoutChange,
      cloneModule,
      editMode,
      layout,
      params,
      dispatch,
      metaData,
      openModule
    } = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <Grid layout={layout} rowHeight={100} onLayoutChange={onLayoutChange}>
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
          </Grid>
        </div>
      </div>
    )
  }
}

ReportGrid.displayName = 'Report-Grid'
ReportGrid.propTypes = {
  modules: React.PropTypes.object.isRequired,
  cloneModule: React.PropTypes.func.isRequired,
  onLayoutChange: React.PropTypes.func.isRequired,
  editMode: React.PropTypes.bool.isRequired,
  layout: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  metaData: React.PropTypes.object.isRequired,
  openModule: React.PropTypes.string
}

export default ReportGrid
