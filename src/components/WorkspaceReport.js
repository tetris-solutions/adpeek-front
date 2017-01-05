import React from 'react'
import ReportContainer from './Report/Container'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'
import values from 'lodash/values'
import endsWith from 'lodash/endsWith'

const WorkspaceReport = React.createClass({
  displayName: 'Workspace-Report',
  propTypes: {
    report: React.PropTypes.object,
    location: React.PropTypes.object,
    metaData: React.PropTypes.object,
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func,
    workspace: React.PropTypes.shape({
      entities: React.PropTypes.shape({
        campaigns: React.PropTypes.array,
        adSets: React.PropTypes.array,
        keywords: React.PropTypes.array,
        adGroups: React.PropTypes.array,
        ads: React.PropTypes.array
      }),
      accounts: React.PropTypes.object
    })
  },
  getAccounts () {
    this._accounts = this._accounts || values(this.props.workspace.accounts)

    return this._accounts
  },
  render () {
    const {metaData, workspace, location} = this.props

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, '_')}
        {...workspace.entities}
        accounts={this.getAccounts()}/>
    )
  }
})

export default contextualize(WorkspaceReport, {metaData: ['reportMetaData']}, 'workspace', 'report')
