import React from 'react'

export default React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf([
    'column',
    'line',
    'pie',
    'table',
    'total'
  ]),
  entity: React.PropTypes.string.isRequired,
  cols: React.PropTypes.number.isRequired,
  rows: React.PropTypes.number.isRequired,
  dimensions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  metrics: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  filters: React.PropTypes.shape({
    id: React.PropTypes.arrayOf(React.PropTypes.string)
  }).isRequired,

  // [["_fields_", ["id", "clicks", "impressions", "cost"]], ["clicks", "desc"]]
  sort: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.string
      ])
    )
  )
})
