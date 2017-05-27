import React from 'react'
import PropTypes from 'prop-types'
import Radio from '../../../Radio'
import Message from 'tetris-iso/Message'
import SharedStrategy from './SharedStrategy'

const PageOnePromoted = props => (
  <SharedStrategy {...props}>
    <Radio
      name='strategy-goal'
      id='page-one-promoted-strategy-goal'
      value='PAGE_ONE_PROMOTED'
      checked={props.strategyGoal === 'PAGE_ONE_PROMOTED'}
      onChange={({target: {value}}) => props.update({strategyGoal: 'PAGE_ONE_PROMOTED'})}>
      <Message>pageOnePromotedGoalLabel</Message>
    </Radio>

    <br/>

    <Radio
      name='strategy-goal'
      id='page-one-strategy-goal'
      value='PAGE_ONE'
      checked={props.strategyGoal === 'PAGE_ONE'}
      onChange={({target: {value}}) => props.update({strategyGoal: 'PAGE_ONE'})}>
      <Message>pageOneGoalLabel</Message>
    </Radio>
  </SharedStrategy>
)

PageOnePromoted.displayName = 'Page-One-Promoted'
PageOnePromoted.propTypes = {
  strategyGoal: PropTypes.oneOf(['PAGE_ONE', 'PAGE_ONE_PROMOTED']),
  update: PropTypes.func
}
PageOnePromoted.contextTypes = {
  messages: PropTypes.object
}

export default PageOnePromoted
