import React from 'react'
import Modal from 'tetris-iso/Modal'
import EditNetwork from './Network'

const EditNetworkModal = props =>
  <Modal size='small' minHeight={0}>
    <EditNetwork {...props}/>
  </Modal>

EditNetworkModal.displayName = 'Edit-Network-Modal'

export default EditNetworkModal
