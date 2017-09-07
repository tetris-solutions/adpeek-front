import React from 'react'
import Modal from '@tetris/front-server/Modal'
import EditGeoLocation from './GeoLocation'
import PropTypes from 'prop-types'

const EditGeoLocationModal = props =>
  <Modal onEscPress={props.cancel} size='large'>
    <EditGeoLocation {...props}/>
  </Modal>

EditGeoLocationModal.displayGeoLocation = 'Edit-Geo-Location-Modal'
EditGeoLocationModal.propTypes = {
  cancel: PropTypes.func
}

export default EditGeoLocationModal
