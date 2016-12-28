import React from 'react'

export default React.PropTypes.shape({
  accounts: React.PropTypes.arrayOf(React.PropTypes.shape({
    ad_account: React.PropTypes.string.isRequired,
    tetris_account: React.PropTypes.string.isRequired,
    platform: React.PropTypes.string.isRequired
  })),
  from: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired
})
