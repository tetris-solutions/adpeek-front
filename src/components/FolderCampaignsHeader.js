import Message from 'tetris-iso/Message'
import React from 'react'
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
  isLoading: React.PropTypes.bool,
  company: React.PropTypes.string,
  workspace: React.PropTypes.string,
  folder: React.PropTypes.string,
  onClickRefresh: React.PropTypes.func,
  onChange: React.PropTypes.func
}

export default FolderCampaignsHeader
