import React from 'react'
import Message from 'tetris-iso/Message'
import {breakOnEmptyProp} from '../higher-order/not-nullable'
import {loadCampaignDetailsAction} from '../../actions/load-campaign-details'
import PropTypes from 'prop-types'
import SubHeader from '../SubHeader'
import Page from '../Page'
import AdwordsCampaign from './Adwords/Card'
import LoadingHorizontal from '../LoadingHorizontal'

const PlatComp = {
  adwords: AdwordsCampaign
}

class CampaignHome extends React.PureComponent {
  static displayName = 'Campaign-Home'

  static propTypes = {
    params: PropTypes.object.isRequired,
    campaign: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      platform: PropTypes.string,
      details: PropTypes.object
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.dispatch(loadCampaignDetailsAction, this.props.params)
  }

  render () {
    const {campaign} = this.props
    const Component = PlatComp[campaign.platform]

    return (
      <div>
        <SubHeader/>
        <Page>
          <section className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              {campaign.details ? <Component {...this.props}/> : (
                <LoadingHorizontal>
                  <Message>loadingCampaignDetails</Message>
                </LoadingHorizontal>)}
            </div>
          </section>
        </Page>
      </div>
    )
  }
}

export default breakOnEmptyProp(CampaignHome, 'campaign')
