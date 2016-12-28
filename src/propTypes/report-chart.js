import React from 'react'

export default {
  result: React.PropTypes.array,
  query: React.PropTypes.shape({
    dimensions: React.PropTypes.array,
    metrics: React.PropTypes.array
  }),
  entity: React.PropTypes.shape({
    id: React.PropTypes.string
  }).isRequired
}
