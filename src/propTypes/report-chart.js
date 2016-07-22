import React from 'react'

const {PropTypes} = React

export default {
  result: PropTypes.array,
  query: PropTypes.shape({
    dimensions: PropTypes.array,
    metrics: PropTypes.array
  }),
  entity: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
}
