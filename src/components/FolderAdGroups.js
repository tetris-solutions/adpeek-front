import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {loadFolderAdGroupsAction} from '../actions/load-folder-adgroups'

const {PropTypes} = React

export const FolderAdGroups = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      account: PropTypes.shape({
        platform: PropTypes.string
      }),
      campaigns: PropTypes.array
    }),
    params: PropTypes.object
  },
  componentDidMount () {
    const {folder, params, dispatch} = this.props

    if (folder.account.platform === 'adwords') {
      dispatch(loadFolderAdGroupsAction,
        params.company,
        params.workspace,
        params.folder)
    }
  },
  render () {
    const {folder} = this.props

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message folder={folder.name}>folderAdsTitle</Message>
          </div>
        </header>

        {folder.account.platform === 'adwords' && (
          <AdGroups adGroups={folder.adGroups || []}/>
        )}
      </div>
    )
  }
})

export default contextualize(FolderAdGroups, 'folder')
