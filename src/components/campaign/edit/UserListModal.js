import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditUserList from './user-list/UserList'

const EditUserListModal = props =>
  <Modal onEscPress={props.cancel} size='large' minHeight={0}>
    <EditUserList {...props}/>
  </Modal>

EditUserListModal.displayName = 'Edit-User-List-Modal'
EditUserListModal.propTypes = {
  cancel: PropTypes.func
}

export default EditUserListModal
