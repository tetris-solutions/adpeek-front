import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import EditCallOut from './Editor'

const EditCallOutModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditCallOut {...props}/>
  </Modal>

EditCallOutModal.displayName = 'Edit-CallOut-Modal'
EditCallOutModal.propTypes = {
  cancel: PropTypes.func
}

export default EditCallOutModal
