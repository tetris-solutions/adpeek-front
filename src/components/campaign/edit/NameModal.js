import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditName from './Name'

const EditNameModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditName {...props}/>
  </Modal>

EditNameModal.displayName = 'Edit-Name-Modal'
EditNameModal.propTypes = {
  cancel: PropTypes.func
}

export default EditNameModal
