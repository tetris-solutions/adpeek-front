import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditLocations from './Locations'

const EditLocationsModal = props =>
  <Modal onEscPress={props.cancel} size='large' minHeight={0}>
    <EditLocations {...props}/>
  </Modal>

EditLocationsModal.displayName = 'Edit-Locations-Modal'
EditLocationsModal.propTypes = {
  cancel: PropTypes.func
}

export default EditLocationsModal
