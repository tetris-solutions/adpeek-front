import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditNetwork from './Network'

const EditNetworkModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditNetwork {...props}/>
  </Modal>

EditNetworkModal.displayName = 'Edit-Network-Modal'
EditNetworkModal.propTypes = {
  cancel: PropTypes.func
}

export default EditNetworkModal
