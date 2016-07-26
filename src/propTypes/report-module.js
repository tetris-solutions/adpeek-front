import React from 'react'

const {PropTypes} = React

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'column',
    'line',
    'pie',
    'table'
  ]),
  dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  metrics: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({
    id: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
}).isRequired
