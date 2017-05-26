import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Radio from '../../../Radio'
import Input from '../../../Input'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isString from 'lodash/isString'
import csjs from 'csjs'
import {styledFunctionalComponent} from '../../../higher-order/styled'

const style = csjs`
.new label {
  font-style: italic
}`

const pickStrategy = (strategy, config) => () => {
  const changes = {
    strategyId: strategy
      ? strategy.id
      : null
  }

  switch (config.type) {
    case 'TARGET_CPA':
      changes.targetCPA = strategy
        ? strategy.scheme.targetCpa
        : config.targetCPA
      break
  }

  config.update(changes)
}

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
          onChange={pickStrategy(strategy, props)}>
          {strategy.name}
        </Radio>
      </div>)}

    <div className={style.new}>
      <Radio
        id='create-strategy'
        name='strategy-id'
        checked={!props.strategyId}
        value=''
        onChange={pickStrategy(null, props)}>
        <Message>newBidStrategy</Message>
      </Radio>
    </div>

    {!props.strategyId && (
      <Input
        name='strategy-name'
        label='name'
        value={isString(props.strategyName)
          ? props.strategyName
          : props.defaultStrategyName}
        onChange={({target: {value: strategyName}}) => props.update({strategyName})}/>)}
  </div>
)

SharedStrategy.displayName = 'Shared-Strategy'
SharedStrategy.propTypes = {
  defaultStrategyName: PropTypes.string,
  strategyId: PropTypes.string,
  strategyName: PropTypes.string,
  bidStrategies: PropTypes.array,
  update: PropTypes.func.isRequired,
  type: PropTypes.string,
  enhancedCPC: PropTypes.bool
}

export default styledFunctionalComponent(SharedStrategy, style)
