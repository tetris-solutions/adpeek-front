import React from 'react'
import ReportBuilder from './ReportBuilder'
import {contextualize} from './higher-order/contextualize'
import map from 'lodash/map'
import assign from 'lodash/assign'
import {loadReportMetaDataAction} from '../actions/load-report-meta-data'

const {PropTypes} = React

const FolderReactBuilder = React.createClass({
  displayName: 'Folder-Report-Builder',
  contextTypes: {
    messages: PropTypes.object
  },
  propTypes: {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      campaigns: PropTypes.array,
      account: PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      })
    })
  },
  componentDidMount () {
    this.props.dispatch(
      loadReportMetaDataAction,
      this.props.params,
      this.props.folder.account.platform,
      'Campaign'
    )
  },
  render () {
    const {folder} = this.props
    const reportParams = {
      ad_account: folder.account.external_id,
      platform: folder.account.platform,
      tetris_account: folder.account.tetris_id
    }
    const campaignEntity = {
      id: 'Campaign',
      name: this.context.messages.campaigns,
      list: map(folder.campaigns, c => assign({}, c, {id: c.external_id}))
    }

    return (
      <ReportBuilder
        {...this.props}
        reportParams={reportParams}
        entity={campaignEntity}/>
    )
  }
})

export default contextualize(FolderReactBuilder, 'folder')
