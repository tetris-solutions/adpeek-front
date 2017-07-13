import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditDeliveryMethod from './DeliveryMethod'

const EditDeliveryMethodModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditDeliveryMethod {...props}/>
  </Modal>

EditDeliveryMethodModal.displayName = 'Edit-Delivery-Method-Modal'
EditDeliveryMethodModal.propTypes = {
  cancel: PropTypes.func
}

export default EditDeliveryMethodModal
