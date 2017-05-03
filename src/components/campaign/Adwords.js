import React from 'react'
import PropTypes from 'prop-types'
import SubHeader from '../SubHeader'
import Page from '../Page'

class AdwordsCampaign extends React.Component {
  render () {
    return (
      <div>
        <SubHeader/>
        <Page>
          abc {this.props.name}
        </Page>
      </div>
    )
  }
}

AdwordsCampaign.displayName = 'Campaign-Home'
AdwordsCampaign.propTypes = {
  name: PropTypes.string.isRequired
}

export default AdwordsCampaign
