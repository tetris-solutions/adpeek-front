import Message from 'tetris-iso/Message'
import React from 'react'

import HeaderSearchBox from './HeaderSearchBox'
import Switch from './Switch'

const {PropTypes} = React

const wrapOnSwitch = onSwitch => ({target: {checked}}) => onSwitch(checked)

export function FolderCampaignsHeader ({
  onChange,
  company,
  workspace,
  folder,
  onSwitch,
  isLoading,
  onClickRefresh
}, {
  messages: {filterActiveCampaigns}
}) {
  return (
    <header className='mdl-layout__header'>
      <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
        <span>
          <Switch label={filterActiveCampaigns} checked onChange={wrapOnSwitch(onSwitch)}/>
        </span>
        <div className='mdl-layout-spacer'/>

        <button type='button' className='mdl-button mdl-color-text--grey-100' onClick={onClickRefresh} disabled={isLoading}>
          <Message>{isLoading ? 'loadingCampaigns' : 'refreshCampaigns'}</Message>
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
  onSwitch: PropTypes.func,
  onClickRefresh: PropTypes.func,
  onChange: PropTypes.func
}
FolderCampaignsHeader.contextTypes = {
  messages: PropTypes.object
}

export default FolderCampaignsHeader
