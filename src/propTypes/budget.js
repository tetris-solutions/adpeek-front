import React from 'react'
import campaignPropType from './campaign'

export default React.PropTypes.shape({
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  percentage: React.PropTypes.number,
  amount: React.PropTypes.number,
  campaigns: React.PropTypes.arrayOf(campaignPropType)
})
