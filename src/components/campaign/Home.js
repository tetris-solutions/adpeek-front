import React from 'react'
import Message from 'tetris-iso/Message'
import {breakOnEmptyProp} from '../higher-order/not-nullable'
import {loadCampaignDetailsAction} from '../../actions/load-campaign-details'
import PropTypes from 'prop-types'
import SubHeader from '../SubHeader'
import Page from '../Page'
import AdwordsCampaign from './adwords/Card'
import LoadingHorizontal from '../LoadingHorizontal'
import {Card, Content, Header} from '../Card'
import {Wrapper, Info, SubText} from './Utils'
import upperFirst from 'lodash/upperFirst'

const NotAvailable = ({campaign: {name, platform, is_adwords_video, details}}) => (
  <Wrapper>
    <Info disabled>
      <Message>nameLabel</Message>:
      <SubText>{name}</SubText>
    </Info>

    <Info disabled>
      <Message>platformLabel</Message>:
      <SubText>{upperFirst(platform)}</SubText>
    </Info>

    <br/>

    <p className='mdl-color--yellow-300 mdl-color-text--grey-700' style={{padding: '1em'}}>
      <strong>
        <Message>emptyCampaignDetails</Message>
      </strong>
    </p>
  </Wrapper>
)

NotAvailable.displayName = 'Not-Available'
NotAvailable.propTypes = {
  campaign: PropTypes.object.isRequired
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
    this.loadDetails()
  }

  loadDetails (fresh = false) {
    return this.props.dispatch(loadCampaignDetailsAction, this.props.params, fresh)
  }

  reload () {
    return this.loadDetails(true)
  }

  render () {
    const {campaign} = this.props
    const Campaign = campaign.platform === 'adwords' && !campaign.is_adwords_video
      ? AdwordsCampaign
      : NotAvailable

    const isLoading = !campaign.details

    return (
      <div>
        <SubHeader/>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              {isLoading ? (
                <LoadingHorizontal>
                  <Message>loadingCampaignDetails</Message>
                </LoadingHorizontal>
              ) : (
                <Card size='medium'>
                  <Header>
                    <Message>campaignDetailsTitle</Message>
                  </Header>
                  <Content>
                    <Campaign {...this.props} reload={this.reload}/>
                  </Content>
                </Card>
              )}
            </div>
          </div>
        </Page>
      </div>
    )
  }
}

export default breakOnEmptyProp(CampaignHome, 'campaign')
