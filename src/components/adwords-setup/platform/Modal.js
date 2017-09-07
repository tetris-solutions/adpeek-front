import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import EditPlatform from './Form'

const EditPlatformModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditPlatform {...props}/>
  </Modal>

EditPlatformModal.displayName = 'Edit-Platform-Modal'
EditPlatformModal.propTypes = {
  cancel: PropTypes.func
}

export default EditPlatformModal
