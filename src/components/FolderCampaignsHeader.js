import React from 'react'

import HeaderSearchBox from './HeaderSearchBox'
import Switch from './Switch'

const {PropTypes} = React

const onChange = onSwitch => ({target: {checked}}) => onSwitch(checked)

export function FolderCampaignsHeader ({
  onEnter,
  company,
  workspace,
  folder,
  onSwitch
}, {
  messages: {filterActiveCampaigns}
}) {
  return (
    <header className='mdl-layout__header'>
      <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
        <span>
          <Switch label={filterActiveCampaigns} checked onChange={onChange(onSwitch)}/>
        </span>
        <div className='mdl-layout-spacer'/>
        <HeaderSearchBox onEnter={onEnter}/>
      </div>
    </header>
  )
}

FolderCampaignsHeader.displayName = 'Campaigns-Header'
FolderCampaignsHeader.propTypes = {
  company: PropTypes.string,
  workspace: PropTypes.string,
  folder: PropTypes.string,
  onSwitch: PropTypes.func,
  onEnter: PropTypes.func
}
FolderCampaignsHeader.contextTypes = {
  messages: PropTypes.object
}

export default FolderCampaignsHeader
