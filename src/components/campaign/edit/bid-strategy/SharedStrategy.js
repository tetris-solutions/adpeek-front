import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Radio from '../../../Radio'
import Input from '../../../Input'
import map from 'lodash/map'
import filter from 'lodash/filter'
import csjs from 'csjs'
import {styledFunctionalComponent} from '../../../higher-order/styled'

const style = csjs`
.new label {
  font-style: italic
}`

const SharedStrategy = props => (
  <div>
    <h6>
      <Message>bidStrategyTitle</Message>
    </h6>

    {map(filter(props.bidStrategies, {type: props.type}), strategy =>
      <div key={strategy.id}>
        <Radio
          id={`strategy-${strategy.id}`}
          name='strategy-id'
          checked={props.strategyId === strategy.id}
          value={strategy.id}
          onChange={() => props.update({strategyId: strategy.id})}>
          {strategy.name}
        </Radio>
      </div>)}

    <div className={style.new}>
      <Radio
        id='create-strategy'
        name='strategy-id'
        checked={!props.strategyId}
        value=''
        onChange={() => props.update({strategyId: null})}>
        <Message>newBidStrategy</Message>
      </Radio>
    </div>

    {!props.strategyId && (
      <Input
        name='strategy-name'
        label='name'
        value={props.strategyName}
        onChange={({target: {value: strategyName}}) => props.update({strategyName})}/>)}
  </div>
)

SharedStrategy.displayName = 'Shared-Strategy'
SharedStrategy.propTypes = {
  strategyId: PropTypes.string,
  strategyName: PropTypes.string,
  bidStrategies: PropTypes.array,
  update: PropTypes.func.isRequired,
  type: PropTypes.string,
  enhancedCPC: PropTypes.bool
}

export default styledFunctionalComponent(SharedStrategy, style)
