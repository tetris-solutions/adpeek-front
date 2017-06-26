import React from 'react'
import PropTypes from 'prop-types'
import Page from '../Page'
import SubHeader from '../SubHeader'

class CreateCampaign extends React.Component {
  static displayName = 'Create-Campaign'

  static propTypes = {
    folder: PropTypes.object
  }

  render () {
    return (
      <div>
        <SubHeader/>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'/>
          </div>
        </Page>
      </div>
    )
  }
}

export default CreateCampaign
