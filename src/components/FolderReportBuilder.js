import React from 'react'
import ReportBuilder from './ReportBuilder'
import {contextualize} from './higher-order/contextualize'
import map from 'lodash/map'
import assign from 'lodash/assign'

const {PropTypes} = React

const FolderReactBuilder = React.createClass({
  displayName: 'Folder-Report-Builder',
  contextTypes: {
    messages: PropTypes.object
  },
  propTypes: {
    folder: PropTypes.shape({
      campaigns: PropTypes.array,
      account: PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      })
    })
  },
  render () {
    const reportParams = {
      ad_account: this.props.folder.account.external_id,
      platform: this.props.folder.account.platform,
      tetris_account: this.props.folder.account.tetris_id
    }
    const campaignEntity = {
      id: 'Campaign',
      name: this.context.messages.campaigns,
      list: map(this.props.folder.campaigns, c => assign({}, c, {id: c.external_id}))
    }

    return (
      <ReportBuilder reportParams={reportParams} entity={campaignEntity}/>
    )
  }
})

export default contextualize(FolderReactBuilder, 'folder')
