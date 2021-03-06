import React from 'react'
import PropTypes from 'prop-types'
import withState from 'recompose/withState'
import size from 'lodash/size'
import map from 'lodash/map'
import Message from '@tetris/front-server/Message'
import BudgetCampaign from './Campaign'
import groupBy from 'lodash/groupBy'
import {Button} from '../../Button'

const enhance = withState('isExpanded', 'setVisibility', false)

function BudgetEditFolderCampaigns ({add, isExpanded, setVisibility, campaigns, budget}) {
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
          budget={budget}
          maybeDisabled
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
              maybeDisabled
              budget={budget}
              actionIcon='add'
              campaign={campaign}
              onClick={add}/>))}
        </div>
      ) : null}
    </div>
  )
}

BudgetEditFolderCampaigns.displayName = 'Budget-Edit-Folder-Campaigns'
BudgetEditFolderCampaigns.propTypes = {
  budget: PropTypes.object,
  isExpanded: PropTypes.bool.isRequired,
  setVisibility: PropTypes.func.isRequired,
  campaigns: PropTypes.array.isRequired,
  add: PropTypes.func.isRequired
}

export default enhance(BudgetEditFolderCampaigns)
