import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditSiteLinks from './site-links/SiteLink'

const EditSiteLinksModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditSiteLinks {...props}/>
  </Modal>

EditSiteLinksModal.displayName = 'Edit-Site-Links-Modal'
EditSiteLinksModal.propTypes = {
  cancel: PropTypes.func
}

export default EditSiteLinksModal
