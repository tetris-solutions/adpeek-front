import React from 'react'
import Modal from 'tetris-iso/Modal'
import EditGeoLocation from './GeoLocation'

const EditGeoLocationModal = props =>
  <Modal size='large'>
    <EditGeoLocation {...props}/>
  </Modal>

EditGeoLocationModal.displayGeoLocation = 'Edit-Geo-Location-Modal'

export default EditGeoLocationModal
