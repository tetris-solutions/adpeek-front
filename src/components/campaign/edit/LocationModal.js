import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
// import EditLocations from './apps/Locations'

const EditLocationsModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    etc etc
  </Modal>

EditLocationsModal.displayName = 'Edit-Locations-Modal'
EditLocationsModal.propTypes = {
  cancel: PropTypes.func
}

export default EditLocationsModal
