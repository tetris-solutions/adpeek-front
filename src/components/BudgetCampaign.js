import React from 'react'
import campaignType from '../propTypes/campaign'

const {PropTypes} = React

function BudgetCampaign ({campaign, actionIcon, onClick}) {
  function onIconClick (e) {
    e.preventDefault()
    onClick(campaign)
  }

  return (
    <div className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar' title={campaign.status.description}>
          {campaign.status.icon}
        </i>
        <span>{campaign.name}</span>
      </span>
      <a className='mdl-list__item-secondary-action' onClick={onIconClick}>
        <i className='material-icons'>{actionIcon}</i>
      </a>
    </div>
  )
}

BudgetCampaign.displayName = 'Campaign'
BudgetCampaign.propTypes = {
  campaign: campaignType.isRequired,
  actionIcon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default BudgetCampaign
