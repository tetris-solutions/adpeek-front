import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Radio from '../../../Radio'
import Input from '../../../Input'
import map from 'lodash/map'
import filter from 'lodash/filter'

const isEnhancedCPC = {type: 'ENHANCED_CPC'}

const EnhancedCPC = ({update, defaultStrategyName, strategyId, strategyName, bidStrategies}) => (
  <div>
    <h6>
      <Message>bidStrategyTitle</Message>
    </h6>

    {map(filter(bidStrategies, isEnhancedCPC), ({id, name}) =>
      <div key={id}>
        <Radio
          id={`strategy-${id}`}
          name='strategy-id'
          checked={strategyId === id}
          value={id}
          onChange={() => update({strategyId: id})}>
          {name}
        </Radio>
      </div>)}

    <div>
      <Radio
        id='create-strategy'
        name='strategy-id'
        checked={!strategyId}
        value=''
        onChange={() => update({strategyId: null})}>
        <Message>newBidStrategy</Message>
      </Radio>
    </div>

    {!strategyId && (
      <Input
        name='strategy-name'
        label='name'
        value={strategyName || defaultStrategyName}
        onChange={({target}) => update({strategyName: target.name})}/>
    )}
  </div>
)

EnhancedCPC.displayName = 'Enhanced-CPC-Form'
EnhancedCPC.propTypes = {
  defaultStrategyName: PropTypes.string,
  strategyId: PropTypes.string,
  strategyName: PropTypes.string,
  bidStrategies: PropTypes.array,
  update: PropTypes.func.isRequired,
  enhancedCPC: PropTypes.bool
}
EnhancedCPC.contextTypes = {
  messages: PropTypes.object
}

export default EnhancedCPC
