import React from 'react'

const {PropTypes} = React

export default PropTypes.shape({
  metrics: PropTypes.array,
  dimensions: PropTypes.array,
  attributes: PropTypes.object
})
