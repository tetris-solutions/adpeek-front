import PropTypes from 'prop-types'

export default {
  config: PropTypes.shape({
    result: PropTypes.array,
    query: PropTypes.shape({
      dimensions: PropTypes.array,
      metrics: PropTypes.array
    }),
    entity: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired
}
