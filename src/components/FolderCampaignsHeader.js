import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import HeaderSearchBox from './HeaderSearchBox'
import SubHeader from './SubHeader'
import {Button} from './Button'

export const FolderCampaignsHeader = ({onChange, isLoading, onClickRefresh}) => (
  <SubHeader>
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

export default FolderCampaignsHeader
