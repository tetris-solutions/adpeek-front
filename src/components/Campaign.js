import React from 'react'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function Campaign ({campaign}) {
  return (
    <div>
      <h1>{campaign.name}</h1>
    </div>
  )
}

Campaign.propTypes = {
  campaign: PropTypes.object
}

export default contextualize(Campaign, 'campaign')
