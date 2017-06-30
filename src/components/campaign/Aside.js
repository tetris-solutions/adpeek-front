import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../higher-order/branch'
import Message from 'tetris-iso/Message'
import startsWith from 'lodash/startsWith'
import {Navigation, NavBt, NavLink, NavBts, Name} from '../Navigation'
import qs from 'query-string'
import isEmpty from 'lodash/isEmpty'
import Fence from '../Fence'

class CampaignAside extends React.PureComponent {
  static displayName = 'Campaign-Aside'

  static propTypes = {
    params: PropTypes.object,
    campaign: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  }
  static contextTypes = {
    location: PropTypes.object
  }

  createAdGroup = e => {
    window.event$.emit('create::adgroup')
  }

  render () {
    const {params: {company, workspace, folder}, campaign} = this.props
    const {location: {query, pathname}} = this.context

    const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`
    const campaignUrl = `${folderUrl}/campaign/${campaign.id}`

    let creativesUrl = `${campaignUrl}/creatives`
    let editCreativesUrl = creativesUrl + '/edit'

    const inCreativesScreen = startsWith(pathname, creativesUrl)
    const editCreativesMode = pathname === editCreativesUrl

    if (inCreativesScreen && !isEmpty(query)) {
      creativesUrl = creativesUrl + '?' + qs.stringify(query)
      editCreativesUrl = editCreativesUrl + '?' + qs.stringify(query)
    }

    const oneWayUpUrl = editCreativesMode ? creativesUrl : (
      inCreativesScreen ? campaignUrl : folderUrl
    )

    return (
      <Navigation icon='format_shapes'>
        <Name>{campaign.name}</Name>

        <NavBts>
          {!inCreativesScreen && (
            <NavLink to={creativesUrl} icon='format_shapes'>
              <Message>creatives</Message>
            </NavLink>)}

          {inCreativesScreen && !editCreativesMode && (
            <NavLink to={editCreativesUrl} icon='create'>
              <Message>edit</Message>
            </NavLink>)}

          <Fence canConfigShopping canEditCampaign>
            <NavLink to={`${campaignUrl}/shopping-setup`} icon='shopping_cart'>
              <Message>shoppingSetupBt</Message>
            </NavLink>
          </Fence>

          {editCreativesMode && (
            <NavBt onClick={this.createAdGroup} icon='library_add'>
              <Message>newAdGroup</Message>
            </NavBt>)}

          <NavLink to={oneWayUpUrl} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavLink>
        </NavBts>
      </Navigation>
    )
  }
}

export default node('folder', 'campaign', CampaignAside)
