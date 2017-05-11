import React from 'react'
import Modal from 'tetris-iso/Modal'
import EditName from './Name'

const EditNameModal = props =>
  <Modal size='small' minHeight={0}>
    <EditName {...props}/>
  </Modal>

EditNameModal.displayName = 'Edit-Name-Modal'

export default EditNameModal
