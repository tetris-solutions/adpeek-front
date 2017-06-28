import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditUserLists from './user-lists/UserLists'

const EditUserListsModal = props =>
  <Modal onEscPress={props.cancel} size='large' minHeight={0}>
    <EditUserLists {...props}/>
  </Modal>

EditUserListsModal.displayName = 'Edit-User-List-Modal'
EditUserListsModal.propTypes = {
  cancel: PropTypes.func
}

export default EditUserListsModal
