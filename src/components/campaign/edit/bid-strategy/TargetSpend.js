import React from 'react'
import PropTypes from 'prop-types'
import {enableAnonymous} from './enableAnonymous'
import Input from '../../../Input'
import Checkbox from '../../../Checkbox'

const TargetSpend = (props, {messages}) => (
  <div>
    <Input
      type='number'
      format='currency'
      name='bidCeiling'
      label='bidCeiling'
      onChange={({target: {value: spendBidCeiling}}) => props.update({spendBidCeiling})}
      value={props.spendBidCeiling}/>

    {!props.useSharedStrategy && (
      <Checkbox
        name='optimize-cpc'
        label={messages.enhancedCPCLabel}
        checked={Boolean(props.spendEnhancedCPC)}
        onChange={({target: {checked: spendEnhancedCPC}}) => props.update({spendEnhancedCPC})}/>
    )}
  </div>
)

TargetSpend.displayName = 'Target-Spend'
TargetSpend.propTypes = {
  useSharedStrategy: PropTypes.bool,
  spendEnhancedCPC: PropTypes.bool,
  spendBidCeiling: PropTypes.number,
  update: PropTypes.func.isRequired
}
TargetSpend.contextTypes = {
  messages: PropTypes.object
}

export default enableAnonymous(TargetSpend)
