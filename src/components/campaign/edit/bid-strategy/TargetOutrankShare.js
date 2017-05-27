import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../Input'
import SharedStrategy from './SharedStrategy'

const TargetOutrankShare = props => (
  <SharedStrategy {...props}>
    <Input
      name='competitorDomain'
      label='competitorDomain'
      value={props.competitorDomain}
      onChange={({target: {value: competitorDomain}}) => props.update({competitorDomain})}/>

    <Input
      type='number'
      format='percentage'
      name='targetOutrankShare'
      label='targetOutrankSharePercent'
      onChange={({target: {value: targetOutrankShare}}) => props.update({targetOutrankShare})}
      value={props.targetOutrankShare}/>

    <Input
      type='number'
      format='currency'
      name='bidCeiling'
      label='bidCeiling'
      onChange={({target: {value: outrankBidCeiling}}) => props.update({outrankBidCeiling})}
      value={props.outrankBidCeiling}/>
  </SharedStrategy>
)

TargetOutrankShare.displayName = 'Target-Outrank-Share'

TargetOutrankShare.propTypes = {
  competitorDomain: PropTypes.string,
  targetOutrankShare: PropTypes.number,
  outrankBidCeiling: PropTypes.number,
  update: PropTypes.func
}

export default TargetOutrankShare
