import React from 'react'
import ReportContainer from './Report/Container'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'
import values from 'lodash/values'
import endsWith from 'lodash/endsWith'

const {PropTypes} = React

const WorkspaceReport = React.createClass({
  displayName: 'Workspace-Report',
  propTypes: {
    report: PropTypes.object,
    location: PropTypes.object,
    metaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    workspace: PropTypes.shape({
      entities: PropTypes.shape({
        campaigns: PropTypes.array,
        adSets: PropTypes.array,
        keywords: PropTypes.array,
        adGroups: PropTypes.array,
        ads: PropTypes.array
      }),
      accounts: PropTypes.object
    })
  },
  render () {
    const {metaData, workspace, location} = this.props
    const {accounts} = workspace

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, '_')}
        {...workspace.entities}
        accounts={values(accounts)}/>
    )
  }
})

export default contextualize(WorkspaceReport, {metaData: ['reportMetaData']}, 'workspace', 'report')
