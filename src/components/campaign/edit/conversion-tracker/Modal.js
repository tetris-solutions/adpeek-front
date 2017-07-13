import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
// import EditConversionTracker from './ConversionTracker'

const EditConversionTrackerModal = props =>
  <Modal onEscPress={props.cancel} size='large' minHeight={0}>
    <Message>notYetImplemented</Message>
  </Modal>

EditConversionTrackerModal.displayName = 'Edit-Conversion-Tracker-Modal'
EditConversionTrackerModal.propTypes = {
  cancel: PropTypes.func
}

export default EditConversionTrackerModal
