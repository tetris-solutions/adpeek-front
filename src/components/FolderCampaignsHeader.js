import Message from 'tetris-iso/Message'
import React from 'react'
import HeaderSearchBox from './HeaderSearchBox'
import SubHeader from './SubHeader'

const {PropTypes} = React

export const FolderCampaignsHeader = ({onChange, isLoading, onClickRefresh}) => (
  <SubHeader>
    <button
      type='button'
      className='mdl-button mdl-color-text--grey-100' onClick={onClickRefresh}
      disabled={isLoading}>
      <Message>{isLoading
        ? 'loadingCampaigns'
        : 'refreshCampaigns'}</Message>
    </button>
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
