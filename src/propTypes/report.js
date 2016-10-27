import React from 'react'

const {PropTypes} = React

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  level: PropTypes.oneOf([
    'folder',
    'workspace',
    'company'
  ]),
  platform: PropTypes.string,
  is_private: PropTypes.bool,
  is_user_selected: PropTypes.bool,
  is_default_report: PropTypes.bool
})
