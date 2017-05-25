import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import EditBidStrategy from './bid-strategy/BidStrategy'

const EditBidStrategyModal = props =>
  <Modal onEscPress={props.cancel} size='large' minHeight={0}>
    <EditBidStrategy {...props}/>
  </Modal>

EditBidStrategyModal.displayName = 'Edit-Bid-Strategy-Modal'
EditBidStrategyModal.propTypes = {
  cancel: PropTypes.func
}

export default EditBidStrategyModal
