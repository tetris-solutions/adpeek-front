import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {Button} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'

class EditLocations extends React.PureComponent {
  static displayName = 'Edit-Locations'

  static propTypes = {
    cancel: PropTypes.func,
    reload: PropTypes.func,
    campaign: PropTypes.object,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    openModal: false
  }

  toggleModal = () => {
    this.setState({openModal: !this.state.openModal})
  }

  onCreate = () => {
    return this.props.reload()
      .then(this.toggleModal)
  }

  save = () => {

  }

  render () {
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div className={style.list}>
            <table/>
          </div>
          <div className={style.actions}>
            <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
              <Message>close</Message>
            </Button>

            <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
              <Message>newLocation</Message>
            </Button>
          </div>
        </div>

        {this.state.openModal && (
          <Modal size='small'>
            <Message>notYetImplemented</Message>
          </Modal>)}
      </div>
    )
  }
}

export default styledComponent(EditLocations, style)
