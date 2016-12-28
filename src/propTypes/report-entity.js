import React from 'react'

export default React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  list: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    headline: React.PropTypes.string,
    description: React.PropTypes.string
  })).isRequired
})
