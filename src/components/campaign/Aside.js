import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../higher-order/branch'
import {Link} from 'react-router'
import Message from 'tetris-iso/Message'
import startsWith from 'lodash/startsWith'
import {Navigation, NavBt, NavBts, Name} from '../Navigation'

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

  }

  render () {
    const {params: {company, workspace, folder}, campaign} = this.props
    const {location: {pathname}} = this.context

    const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`

    const creativesUrl = `${folderUrl}/campaign/${campaign.id}/creatives`
    const editCreativesUrl = creativesUrl + '/edit'

    const inCreativesScreen = startsWith(pathname, creativesUrl)
    const editCreativesMode = pathname === editCreativesUrl

    return (
      <Navigation icon='format_shapes'>
        <Name>{campaign.name}</Name>

        <NavBts>
          {!inCreativesScreen && (
            <NavBt tag={Link} to={creativesUrl} icon='format_shapes'>
              <Message>creatives</Message>
            </NavBt>)}

          {inCreativesScreen && !editCreativesMode && (
            <NavBt tag={Link} to={editCreativesUrl} icon='create'>
              <Message>edit</Message>
            </NavBt>)}

          {editCreativesMode && (
            <NavBt onClick={this.createAdGroup} icon='library_add'>
              <Message>newAdGroup</Message>
            </NavBt>)}

          <NavBt tag={Link} to={editCreativesMode ? creativesUrl : folderUrl} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavBt>
        </NavBts>
      </Navigation>
    )
  }
}

export default node('folder', 'campaign', CampaignAside)
