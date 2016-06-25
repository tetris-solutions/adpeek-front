import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'

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
  render () {
    const {params, dispatch, folder} = this.props

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message folder={folder.name}>folderAdsTitle</Message>
          </div>
        </header>

        {folder.account.platform === 'adwords' && (
          <AdGroups
            campaigns={folder.campaigns}
            dispatch={dispatch}
            params={params}/>
        )}
      </div>
    )
  }
})

export default contextualize(FolderAdGroups, 'folder')
