import Message from 'tetris-iso/Message'
import React from 'react'
import HeaderSearchBox from './HeaderSearchBox'

const {PropTypes} = React

export function FolderCampaignsHeader ({
  onChange,
  isLoading,
  onClickRefresh
}) {
  return (
    <header className='mdl-layout__header'>
      <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
        <span/>
        <div className='mdl-layout-spacer'/>
        <button
          type='button'
          className='mdl-button mdl-color-text--grey-100' onClick={onClickRefresh}
          disabled={isLoading}>

          <Message>{isLoading
            ? 'loadingCampaigns'
            : 'refreshCampaigns'}</Message>
        </button>

        <HeaderSearchBox onChange={onChange}/>
      </div>
    </header>
  )
}

FolderCampaignsHeader.displayName = 'Campaigns-Header'
FolderCampaignsHeader.propTypes = {
  isLoading: PropTypes.bool,
  company: PropTypes.string,
  workspace: PropTypes.string,
  folder: PropTypes.string,
  onClickRefresh: PropTypes.func,
  onChange: PropTypes.func
}

export default FolderCampaignsHeader
