import React from 'react'
import PropTypes from 'prop-types'
import AnonymousStrategyToggle from './AnonymousStrategyToggle'
import Input from '../../../Input'
import get from 'lodash/get'
import find from 'lodash/find'
import isNumber from 'lodash/isNumber'

const TargetCPA = props => (
  <AnonymousStrategyToggle {...props}>
    <Input
      type='number'
      format='currency'
      name='targetCPA'
      label='targetCPA'
      onChange={({target: {value: targetCPA}}) => props.update({targetCPA})}
      value={isNumber(props.targetCPA)
        ? props.targetCPA
        : get(find(props.bidStrategies, {id: props.strategyId}), 'scheme.targetCpa')}/>
  </AnonymousStrategyToggle>
)

TargetCPA.displayName = 'Target-CPA'
TargetCPA.propTypes = {
  bidStrategies: PropTypes.array,
  strategyId: PropTypes.string,
  targetCPA: PropTypes.number,
  update: PropTypes.func.isRequired
}
export default TargetCPA
