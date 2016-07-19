import React from 'react'
import ReportBuilder from './ReportBuilder'
import {contextualize} from './higher-order/contextualize'
const {PropTypes} = React

const FolderReactBuilder = React.createClass({
  displayName: 'Folder-Report-Builder',
  contextTypes: {
    messages: PropTypes.object
  },
  propTypes: {
    folder: PropTypes.shape({
      campaigns: PropTypes.array
    })
  },
  render () {
    const campaignEntity = {
      id: 'Campaign',
      name: this.context.messages.campaigns,
      list: this.props.folder.campaigns
    }

    return (
      <ReportBuilder entity={campaignEntity}/>
    )
  }
})

export default contextualize(FolderReactBuilder, 'folder')
