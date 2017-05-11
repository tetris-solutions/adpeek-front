import React from 'react'
import Modal from 'tetris-iso/Modal'
import EditLanguage from './Language'

const EditLanguageModal = props =>
  <Modal size='small'>
    <EditLanguage {...props}/>
  </Modal>

EditLanguageModal.displayLanguage = 'Edit-Language-Modal'

export default EditLanguageModal
