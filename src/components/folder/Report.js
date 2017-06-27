import React from 'react'
import PropTypes from 'prop-types'
import ReportContainer from '../report/Container'
import {branch} from '../higher-order/branch'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

class FolderReport extends React.Component {
  static displayName = 'Folder-Report'

  static propTypes = {
    report: PropTypes.object,
    location: PropTypes.object,
    reportMetaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      account: PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      }),
      entities: PropTypes.shape({
        campaigns: PropTypes.array,
        adSets: PropTypes.array,
        keywords: PropTypes.array,
        adGroups: PropTypes.array,
        ads: PropTypes.array,
        strategies: PropTypes.array
      })
    })
  }

  getAccounts = () => {
    this._accounts = this._accounts || [this.props.folder.account]

    return this._accounts
  }

  render () {
    const {reportMetaData: metaData, folder, location} = this.props

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, folder.account.platform)}
        {...folder.entities}
        accounts={this.getAccounts()}/>
    )
  }
}

export default branch('reportMetaData', FolderReport, 2)
