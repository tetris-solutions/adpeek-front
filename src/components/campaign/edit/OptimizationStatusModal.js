import React from 'react'
import Modal from 'tetris-iso/Modal'
import OptimizationStatus from './OptimizationStatus'

const EditOptimizationStatusModal = props =>
  <Modal size='small' minHeight={0}>
    <OptimizationStatus {...props}/>
  </Modal>

EditOptimizationStatusModal.displayName = 'Edit-Optimization-Status-Modal'

export default EditOptimizationStatusModal
