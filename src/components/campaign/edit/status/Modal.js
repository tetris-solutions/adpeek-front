import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import EditStatus from './Status'

const EditStatusModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditStatus {...props}/>
  </Modal>

EditStatusModal.displayName = 'Edit-Status-Modal'
EditStatusModal.propTypes = {
  cancel: PropTypes.func
}

export default EditStatusModal
