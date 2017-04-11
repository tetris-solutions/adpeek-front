import React from 'react'

import PropTypes from 'prop-types'

function Icon ({className, is_private, is_global}, {messages}) {
  let title = messages.companyReportTooltip
  let icon = 'people'

  if (is_private) {
    icon = 'lock'
    title = messages.privateReportTooltip
  } else if (is_global) {
    icon = 'public'
    title = messages.globalReportTooltip
  }

  return (
    <i className={`material-icons ${className || ''}`} title={title}>
      {icon}
    </i>
  )
}

Icon.displayName = 'Report-Icon'

Icon.propTypes = {
  className: PropTypes.string,
  is_global: PropTypes.bool,
  is_private: PropTypes.bool
}

Icon.contextTypes = {
  messages: PropTypes.object
}

export default Icon
