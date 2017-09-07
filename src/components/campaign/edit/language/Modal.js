import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import EditLanguage from './Language'

const EditLanguageModal = props =>
  <Modal onEscPress={props.cancel} size='small'>
    <EditLanguage {...props}/>
  </Modal>

EditLanguageModal.displayLanguage = 'Edit-Language-Modal'
EditLanguageModal.propTypes = {
  cancel: PropTypes.func
}

export default EditLanguageModal
