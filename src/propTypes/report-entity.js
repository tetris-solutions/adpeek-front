import React from 'react'

const {PropTypes} = React

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    headline: PropTypes.string,
    description: PropTypes.string
  })).isRequired
})
