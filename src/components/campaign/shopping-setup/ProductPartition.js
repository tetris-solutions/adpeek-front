import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../Form'
import {Submit} from '../../Button'
import {loadCampaignAdGroupsAction} from '../../../actions/load-campaign-adgroups'
import map from 'lodash/map'
import AdGroup from './AdGroup'
import {Tree} from '../../Tree'

class ProductPartition extends React.Component {
  static displayName = 'Product-Partition'

  static propTypes = {
    folder: PropTypes.shape({
      productCategories: PropTypes.array.isRequired
    }),
    campaign: PropTypes.shape({
      adGroups: PropTypes.array
    }),
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {}

  componentDidMount () {
    if (!this.ready()) {
      this.loadAdGroups()
    }
  }

  ready () {
    return Boolean(this.props.campaign.adGroups)
  }

  loadAdGroups () {
    return this.props.dispatch(
      loadCampaignAdGroupsAction,
      this.props.params)
  }

  save = () => {

  }

  render () {
    if (!this.ready()) {
      return <Message>loadingAdGroups</Message>
    }

    return (
      <Form onSubmit={this.save}>
        <Tree>
          {map(this.props.campaign.adGroups, adGroup =>
            <AdGroup
              key={adGroup.id}
              categories={this.props.folder.productCategories}
              params={{adGroup: adGroup.id}}/>)}
        </Tree>
        <hr/>
        <div>
          <Submit className='mdl-button mdl-button-primary' style={{float: 'right'}}>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default ProductPartition
