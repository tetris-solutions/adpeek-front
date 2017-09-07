import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import EditTracking from './Form'

const EditTrackingModal = props =>
  <Modal onEscPress={props.cancel} size='small' minHeight={0}>
    <EditTracking {...props}/>
  </Modal>

EditTrackingModal.displayName = 'Edit-Tracking-Modal'
EditTrackingModal.propTypes = {
  cancel: PropTypes.func
}

export default EditTrackingModal
