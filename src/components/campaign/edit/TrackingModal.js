import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditTracking from './tracking/Form'

const EditTrackingModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditTracking {...props}/>
  </Modal>

EditTrackingModal.displayName = 'Edit-Tracking-Modal'
EditTrackingModal.propTypes = {
  cancel: PropTypes.func
}

export default EditTrackingModal
