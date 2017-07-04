import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Page from '../../Page'
import SubHeader from '../../SubHeader'
import {Card, Content} from '../../Card'
import {Tabs, Tab} from '../../Tabs'
import ProductScope from './ProductScope'
import {loadCampaignShoppingSetupAction} from '../../../actions/load-campaign-shopping-setup'
import {loadProductCategoriesAction} from '../../../actions/load-product-categories'
import Loading from '../../LoadingHorizontal'
import once from 'lodash/once'

class ShoppingSetupContainer extends React.Component {
  static displayName = 'Shopping-Setup-Container'

  static propTypes = {
    folder: PropTypes.object,
    campaign: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  componentDidMount () {
    this.loadOnDemand()
  }

  componentDidUpdate () {
    this.loadOnDemand()
  }

  loadOnDemand () {
    if (!this.setupReady()) {
      return this.loadSetup()
    }

    if (!this.metaDataReady()) {
      return this.loadMetaData()
    }
  }

  setupReady () {
    return Boolean(this.props.campaign.productScope)
  }

  metaDataReady () {
    return Boolean(this.props.folder.productCategories)
  }

  loadMetaData = once(() => this.props.dispatch(
    loadProductCategoriesAction,
    this.props.params,
    this.props.campaign.salesCountry
  ))

  loadSetup = once(() => this.props.dispatch(
    loadCampaignShoppingSetupAction,
    this.props.params
  ))

  render () {
    let content

    if (!this.setupReady()) {
      content = (
        <Loading>
          <Message name={<Message>shoppingSetupTitle</Message>}>
            loadingEntity
          </Message>
        </Loading>
      )
    } else if (!this.metaDataReady()) {
      content = (
        <Loading>
          <Message>loadingCategories</Message>
        </Loading>
      )
    } else {
      content = (
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
      )
    }

    return (
      <div>
        <SubHeader title={<Message>shoppingSetupTitle</Message>}/>
        <Page>
          {content}
        </Page>
      </div>
    )
  }
}

export default ShoppingSetupContainer
