import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {Link} from 'react-router'
import HeaderSearchBox from './HeaderSearchBox'
import Switch from './Switch'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

const onChange = onSwitch => ({target: {checked}}) => onSwitch(checked)

export function CampaignsHeader ({onEnter, company, workspace, folder, onSwitch, messages: {filterActiveCampaigns}}) {
  return (
    <header className='mdl-layout__header'>
      <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
        <span>
          <Switch label={filterActiveCampaigns} checked onChange={onChange(onSwitch)}/>
        </span>
        <div className='mdl-layout-spacer'/>
        <Link
          className='mdl-button mdl-color-text--grey-100'
          to={`/company/${company}/workspace/${workspace}/folder/${folder}/create/campaign`}>
          <Message>newCampaignCallToAction</Message>
        </Link>
        <HeaderSearchBox onEnter={onEnter}/>
      </div>
    </header>
  )
}

CampaignsHeader.displayName = 'Campaigns-Header'
CampaignsHeader.propTypes = {
  company: PropTypes.string,
  workspace: PropTypes.string,
  folder: PropTypes.string,
  onSwitch: PropTypes.func,
  onEnter: PropTypes.func,
  messages: PropTypes.object
}

export default contextualize(CampaignsHeader, 'messages')
