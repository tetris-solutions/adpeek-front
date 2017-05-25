import React from 'react'
import PropTypes from 'prop-types'
import SharedStrategy from './SharedStrategy'

const EnhancedCPC = props => (
  <div>
    <SharedStrategy {...props}/>
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
