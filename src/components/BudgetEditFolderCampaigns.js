import React from 'react'
import withState from 'recompose/withState'
import size from 'lodash/size'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import BudgetCampaign from './BudgetCampaign'
import groupBy from 'lodash/groupBy'
import {Button} from './Button'

const {PropTypes} = React
const enhance = withState('isExpanded', 'setVisibility', false)

function BudgetEditFolderCampaigns ({add, isExpanded, setVisibility, campaigns}) {
  const msgName = isExpanded ? 'hideNCampaigns' : 'showNCampaigns'
  const grouped = groupBy(campaigns, 'status.is_active')
  const activeCampaigns = grouped.true || []
  const inactiveCampaigns = grouped.false || []
  const toggleVisibility = () => setVisibility(!isExpanded)
  const inactiveCount = size(inactiveCampaigns)

  return (
    <div className='mdl-list'>
      {map(activeCampaigns, campaign => (
        <BudgetCampaign
          key={campaign.id}
          campaign={campaign}
          actionIcon='add'
          onClick={add}/>
      ))}

      {inactiveCount ? (
        <div>
          <p style={{textAlign: 'center'}}>
            <Button className='mdl-button' onClick={toggleVisibility}>
              <Message count={String(inactiveCount)}>{msgName}</Message>
            </Button>
          </p>

          {map(isExpanded && inactiveCampaigns, campaign => (
            <BudgetCampaign
              key={campaign.id}
              actionIcon='add'
              campaign={campaign}
              onClick={add}/>
          ))}
        </div>
      ) : null}
    </div>
  )
}

BudgetEditFolderCampaigns.displayName = 'Budget-Edit-Folder-Campaigns'
BudgetEditFolderCampaigns.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setVisibility: PropTypes.func.isRequired,
  campaigns: PropTypes.array.isRequired,
  add: PropTypes.func.isRequired
}

export default enhance(BudgetEditFolderCampaigns)
