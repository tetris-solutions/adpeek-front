import React from 'react'
import PropTypes from 'prop-types'
import {enableAnonymous} from './enableAnonymous'
import Input from '../../../Input'

const TargetCPA = props => (
  <Input
    type='number'
    format='currency'
    name='targetCPA'
    label='targetCPA'
    onChange={({target: {value: targetCPA}}) => props.update({targetCPA})}
    value={props.targetCPA}/>
)

TargetCPA.displayName = 'Target-CPA'
TargetCPA.propTypes = {
  bidStrategies: PropTypes.array,
  strategyId: PropTypes.string,
  targetCPA: PropTypes.number,
  update: PropTypes.func.isRequired
}
export default enableAnonymous(TargetCPA)
