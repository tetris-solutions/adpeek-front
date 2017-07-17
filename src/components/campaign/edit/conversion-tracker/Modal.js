import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditConversionTracker from './ConversionTracker'

const EditConversionTrackerModal = props =>
  <Modal onEscPress={props.cancel} size='medium' minHeight={0}>
    <EditConversionTracker {...props}/>
  </Modal>

EditConversionTrackerModal.displayName = 'Edit-Conversion-Tracker-Modal'
EditConversionTrackerModal.propTypes = {
  cancel: PropTypes.func
}

export default EditConversionTrackerModal
