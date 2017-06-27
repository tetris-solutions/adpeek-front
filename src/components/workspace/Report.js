import React from 'react'
import PropTypes from 'prop-types'
import ReportContainer from '../report/Container'
import {branch} from '../higher-order/branch'
import get from 'lodash/get'
import values from 'lodash/values'
import endsWith from 'lodash/endsWith'

class WorkspaceReport extends React.Component {
  static displayName = 'Workspace-Report'

  static propTypes = {
    report: PropTypes.object,
    location: PropTypes.object,
    reportMetaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    workspace: PropTypes.shape({
      entities: PropTypes.shape({
        campaigns: PropTypes.array
      }),
      accounts: PropTypes.object
    })
  }

  getAccounts = () => {
    this._accounts = this._accounts || values(this.props.workspace.accounts)

    return this._accounts
  }

  render () {
    const {reportMetaData: metaData, workspace, location} = this.props

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, '_')}
        {...workspace.entities}
        accounts={this.getAccounts()}/>
    )
  }
}

export default branch('reportMetaData', WorkspaceReport, 2)
