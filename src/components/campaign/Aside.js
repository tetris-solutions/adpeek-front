import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../higher-order/branch'
import {Link} from 'react-router'
import Message from 'tetris-iso/Message'
import startsWith from 'lodash/startsWith'
import {Navigation, NavBt, NavBts, Name} from '../Navigation'

export const CampaignAside = ({params: {company, workspace, folder}, campaign}, {location: {pathname}}) => {
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

        <NavBt tag={Link} to={editCreativesMode ? creativesUrl : folderUrl} icon='close'>
          <Message>oneLevelUpNavigation</Message>
        </NavBt>
      </NavBts>
    </Navigation>
  )
}

CampaignAside.displayName = 'Campaign-Aside'
CampaignAside.propTypes = {
  params: PropTypes.object,
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}
CampaignAside.contextTypes = {
  location: PropTypes.object
}
export default node('folder', 'campaign', CampaignAside)
