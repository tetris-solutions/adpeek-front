import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

export const injectCampaign = Component => class extends React.Component {
  static displayName = `inectCampaign(${Component.displayName})`

  static propTypes = {
    campaign: PropTypes.shape({
      details: PropTypes.object
    })
  }

  render () {
    return (
      <Component
        {...omit(this.props, 'campaign')}
        {...this.props.campaign.details}
        level='campaign'/>
    )
  }
}
