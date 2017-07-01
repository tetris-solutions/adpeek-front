import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Page from '../../Page'
import SubHeader from '../../SubHeader'
import {Card, Content} from '../../Card'
import {Tabs, Tab} from '../../Tabs'
import ProductScope from './ProductScope'
import {loadCampaignShoppingSetupAction} from '../../../actions/load-campaign-shopping-setup'
import Loading from '../../LoadingHorizontal'

class ShoppingSetupContainer extends React.Component {
  static displayName = 'Shopping-Setup-Container'

  static propTypes = {
    folder: PropTypes.object,
    campaign: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  componentDidMount () {
    if (!this.setupReady()) {
      this.loadSetup()
    }
  }

  setupReady () {
    return Boolean(this.props.campaign.productScope)
  }

  loadSetup () {
    return this.props.dispatch(
      loadCampaignShoppingSetupAction,
      this.props.params
    )
  }

  render () {
    return (
      <div>
        <SubHeader title={<Message>shoppingSetupTitle</Message>}/>
        <Page>{this.setupReady() ? (
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <Card size='full'>
                <Content>
                  <Tabs>
                    <Tab id='product-scope' title={<Message>productScope</Message>}>
                      <br/>
                      <ProductScope {...this.props}/>
                    </Tab>
                  </Tabs>
                </Content>
              </Card>
            </div>
          </div>
        ) : (
          <Loading>
            <Message name={<Message>shoppingSetupTitle</Message>}>
              loadingEntity
            </Message>
          </Loading>)}
        </Page>
      </div>
    )
  }
}

export default ShoppingSetupContainer
