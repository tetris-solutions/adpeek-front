import React from 'react'
import PropTypes from 'prop-types'
import AnonymousStrategyToggle from './AnonymousStrategyToggle'
import Input from '../../../Input'

const TargetROAS = props => (
  <AnonymousStrategyToggle {...props}>
    <Input
      type='number'
      format='percentage'
      name='targetROAS'
      label='targetROAS'
      onChange={({target: {value: targetROAS}}) => props.update({targetROAS})}
      value={props.targetROAS}/>
  </AnonymousStrategyToggle>
)

TargetROAS.displayName = 'Target-ROAS'
TargetROAS.propTypes = {
  bidStrategies: PropTypes.array,
  strategyId: PropTypes.string,
  targetROAS: PropTypes.number,
  update: PropTypes.func.isRequired
}
export default TargetROAS
