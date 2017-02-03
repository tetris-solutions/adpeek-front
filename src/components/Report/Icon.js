import React from 'react'

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
    <i className={`material-icons mdl-color-text--grey-600 ${className || ''}`} title={title}>
      {icon}
    </i>
  )
}

Icon.displayName = 'Report-Icon'

Icon.propTypes = {
  className: React.PropTypes.string,
  is_global: React.PropTypes.bool,
  is_private: React.PropTypes.bool
}

Icon.contextTypes = {
  messages: React.PropTypes.object
}

export default Icon
