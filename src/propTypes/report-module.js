import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'column',
    'line',
    'pie',
    'table',
    'total'
  ]),
  entity: PropTypes.string.isRequired,
  cols: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  metrics: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({
    id: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,

  // [["_fields_", ["id", "clicks", "impressions", "cost"]], ["clicks", "desc"]]
  sort: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
      ])
    )
  )
})
