import React from 'react'
import campaignPropType from './campaign'

const {PropTypes} = React

export default PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  percentage: PropTypes.number,
  amount: PropTypes.number,
  campaigns: PropTypes.arrayOf(campaignPropType)
})
