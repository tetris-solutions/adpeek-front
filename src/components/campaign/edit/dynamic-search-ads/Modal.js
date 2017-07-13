import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditDynamicSearchAds from './DynamicSearchAds'

const EditDynamicSearchAdsModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditDynamicSearchAds {...props}/>
  </Modal>

EditDynamicSearchAdsModal.displayName = 'Edit-Dynamic-Search-Ads-Modal'
EditDynamicSearchAdsModal.propTypes = {
  cancel: PropTypes.func
}

export default EditDynamicSearchAdsModal
