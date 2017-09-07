import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import HeaderSearchBox from '../../HeaderSearchBox'
import SubHeader from '../../SubHeader'
import {Button} from '../../Button'
import {Link} from 'react-router'
import Fence from '../../Fence'

export const FolderCampaignsHeader = ({onChange, isLoading, onClickRefresh}, {location}) => (
  <SubHeader>
    <Fence canEditCampaign>
      <Link
        to={`${location.pathname}/create/campaign`}
        className='mdl-button mdl-color-text--grey-100'>
        <Message>newCampaign</Message>
      </Link>
    </Fence>

    <Button
      className='mdl-button mdl-color-text--grey-100'
      onClick={onClickRefresh}
      disabled={isLoading}>
      <Message>{isLoading
        ? 'loadingCampaigns'
        : 'refreshCampaigns'}</Message>
    </Button>
    <HeaderSearchBox onChange={onChange}/>
  </SubHeader>
)

FolderCampaignsHeader.displayName = 'Campaigns-Header'
FolderCampaignsHeader.propTypes = {
  isLoading: PropTypes.bool,
  company: PropTypes.string,
  workspace: PropTypes.string,
  folder: PropTypes.string,
  onClickRefresh: PropTypes.func,
  onChange: PropTypes.func
}

FolderCampaignsHeader.contextTypes = {
  location: PropTypes.object
}

export default FolderCampaignsHeader
