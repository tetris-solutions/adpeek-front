import React from 'react'
import Modal from 'tetris-iso/Modal'
import EditDeliveryMethod from './DeliveryMethod'

const EditDeliveryMethodModal = props =>
  <Modal size='small' minHeight={0}>
    <EditDeliveryMethod {...props}/>
  </Modal>

EditDeliveryMethodModal.displayName = 'Edit-Delivery-Method-Modal'

export default EditDeliveryMethodModal
