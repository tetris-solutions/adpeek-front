import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '../../../Checkbox'

const ManualCPC = ({update, enhancedCPC}, {messages}) => (
  <div>
    <Checkbox
      name='optimize-cpc'
      label={messages.enhancedCPCLabel}
      checked={Boolean(enhancedCPC)}
      onChange={({target: {checked: enhancedCPC}}) => update({enhancedCPC})}/>
  </div>
)

ManualCPC.displayName = 'Manual-CPC-Form'
ManualCPC.propTypes = {
  update: PropTypes.func.isRequired,
  enhancedCPC: PropTypes.bool
}
ManualCPC.contextTypes = {
  messages: PropTypes.object
}

export default ManualCPC
