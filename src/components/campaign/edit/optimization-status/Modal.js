import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import OptimizationStatus from './OptimizationStatus'

const EditOptimizationStatusModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <OptimizationStatus {...props}/>
  </Modal>

EditOptimizationStatusModal.displayName = 'Edit-Optimization-Status-Modal'
EditOptimizationStatusModal.propTypes = {
  cancel: PropTypes.func
}

export default EditOptimizationStatusModal
