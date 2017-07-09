import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../Form'
import {Submit} from '../../Button'
import {loadCampaignAdGroupsAction} from '../../../actions/load-campaign-adgroups'
import {updateAdGroupProductPartitionAction} from '../../../actions/update-adgroup-product-partitions'
import map from 'lodash/map'
import AdGroup from './AdGroup'
import {Tree} from '../../Tree'
import assign from 'lodash/assign'

const campaignPropType = PropTypes.shape({
  adGroups: PropTypes.array
})

class ProductPartition extends React.Component {
  static displayName = 'Product-Partition'

  static propTypes = {
    folder: PropTypes.shape({
      productCategories: PropTypes.array.isRequired
    }),
    campaign: campaignPropType,
    cursors: PropTypes.shape({
      campaign: campaignPropType
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
    const {cursors: {campaign}, dispatch, params} = this.props

    const promises = map(campaign.adGroups,
      ({id: adGroup, partitions}) =>
        partitions
          ? dispatch(updateAdGroupProductPartitionAction, assign({adGroup}, params), partitions)
          : Promise.resolve())

    return Promise.all(promises)
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
