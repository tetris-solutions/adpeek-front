import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import EditApps from './Apps'

const EditAppsModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditApps {...props}/>
  </Modal>

EditAppsModal.displayName = 'Edit-Apps-Modal'
EditAppsModal.propTypes = {
  cancel: PropTypes.func
}

export default EditAppsModal
