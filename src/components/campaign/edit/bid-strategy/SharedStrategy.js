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

const SharedStrategy = ({update, type, defaultStrategyName, strategyId, strategyName, bidStrategies}) => (
  <div>
    <h6>
      <Message>bidStrategyTitle</Message>
    </h6>

    {map(filter(bidStrategies, {type}), ({id, name}) =>
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

    <div className={style.new}>
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
        value={isString(strategyName)
          ? strategyName
          : defaultStrategyName}
        onChange={({target: {value: strategyName}}) => update({strategyName})}/>)}
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
