import PropTypes from 'prop-types'

export default PropTypes.shape({
  accounts: PropTypes.arrayOf(PropTypes.shape({
    ad_account: PropTypes.string.isRequired,
    tetris_account: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired
  })),
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
})
