import React from 'react'
import Report from './Report'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'
import values from 'lodash/values'

const {PropTypes} = React

const FolderReport = React.createClass({
  displayName: 'Workspace-Report',
  propTypes: {
    report: PropTypes.object,
    location: PropTypes.object,
    metaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    workspace: PropTypes.shape({
      campaigns: PropTypes.array,
      adSets: PropTypes.array,
      keywords: PropTypes.array,
      adGroups: PropTypes.array,
      ads: PropTypes.array,
      accounts: PropTypes.object
    })
  },
  render () {
    const {params, metaData, dispatch, report, workspace, location} = this.props
    const {accounts} = workspace

    return (
      <Report
        dispatch={dispatch}
        report={report}
        location={location}
        params={params}
        metaData={get(metaData, '_')}
        ads={workspace.ads}
        adGroups={workspace.adGroups}
        adSets={workspace.adSets}
        campaigns={workspace.campaigns}
        keywords={workspace.keywords}
        accounts={values(accounts)}/>
    )
  }
})

export default contextualize(FolderReport, {metaData: ['reportMetaData']}, 'workspace', 'report')
