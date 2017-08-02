import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string,
  external_id: PropTypes.string,
  name: PropTypes.string,
  biddingStrategy: PropTypes.object,
  status: PropTypes.shape({
    status: PropTypes.string
  })
})
