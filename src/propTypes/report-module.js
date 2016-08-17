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
  entity: PropTypes.string.isRequired,
  cols: PropTypes.oneOf([12, 8, 6, 4]).isRequired,
  rows: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  metrics: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({
    id: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
})
