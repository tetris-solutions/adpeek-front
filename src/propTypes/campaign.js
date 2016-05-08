import React from 'react'

const {PropTypes} = React

export default PropTypes.shape({
  id: PropTypes.string,
  external_id: PropTypes.string,
  name: PropTypes.string
})
