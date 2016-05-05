import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {Link} from 'react-router'
import HeaderSearchBox from './HeaderSearchBox'
import Switch from './Switch'

const {PropTypes} = React

export function CampaignsHeader ({onEnter, company, workspace, folder, onSwitch}) {
  return (
    <header className='mdl-layout__header'>
      <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
        <span>
          <Switch label='Filter active campaigns' checked onSwitch={onSwitch}/>
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
  onEnter: PropTypes.func
}

export default CampaignsHeader
