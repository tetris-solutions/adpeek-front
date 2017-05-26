import React from 'react'
import PropTypes from 'prop-types'
import AnonymousStrategyToggle from './AnonymousStrategyToggle'
import Input from '../../../Input'

const TargetCPA = props => (
  <AnonymousStrategyToggle {...props}>
    <Input
      type='number'
      format='currency'
      name='targetCPA'
      label='targetCPA'
      onChange={({target: {value: targetCPA}}) => props.update({targetCPA})}
      value={props.targetCPA}/>
  </AnonymousStrategyToggle>
)

TargetCPA.displayName = 'Target-CPA'
TargetCPA.propTypes = {
  targetCPA: PropTypes.number,
  update: PropTypes.func.isRequired
}
export default TargetCPA
