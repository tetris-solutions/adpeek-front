import React from 'react'

const {PropTypes} = React

export default {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'column',
    'line',
    'pie',
    'table'
  ]),
  dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({
    id: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  entity: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
}
