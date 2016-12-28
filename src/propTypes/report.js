import React from 'react'

export default React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  level: React.PropTypes.oneOf([
    'folder',
    'workspace',
    'company'
  ]),
  platform: React.PropTypes.string,
  is_private: React.PropTypes.bool,
  is_user_selected: React.PropTypes.bool,
  is_default_report: React.PropTypes.bool
})
