import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '../../../Checkbox'

const ManualCPC = ({update, optimizeCPC}, {messages}) => (
  <div>
    <Checkbox
      name='optimize-cpc'
      label={messages.optimizeCPCLabel}
      checked={Boolean(optimizeCPC)}
      onChange={({target: {checked: optimizeCPC}}) => update({optimizeCPC})}/>
  </div>
)

ManualCPC.displayName = 'Manual-CPC-Form'
ManualCPC.propTypes = {
  update: PropTypes.func.isRequired,
  optimizeCPC: PropTypes.bool
}
ManualCPC.contextTypes = {
  messages: PropTypes.object
}

export default ManualCPC
