import PropTypes from 'prop-types'
import campaignPropType from './campaign'

export default PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  percentage: PropTypes.number,
  amount: PropTypes.number,
  campaigns: PropTypes.arrayOf(campaignPropType)
})
