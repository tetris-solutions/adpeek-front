import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {Button} from './Button'

class OrderSpawnAutoBudget extends React.Component {
  static displayName = 'Order-Spawn-Auto-Budget'

  static propTypes = {
    runAutoBudget: PropTypes.func.isRequired
  }

  state = {
    isModalOpen: false
  }

  open = () => {
    this.setState({isModalOpen: true})
  }

  close = () => {
    this.setState({isModalOpen: false})
  }

  confirm = () => {
    this.props.runAutoBudget()
    this.close()
  }

  render () {
    return (
      <Button onClick={this.open} className='mdl-button mdl-color-text--grey-100'>
        <Message>manuallyRunAutoBudget</Message>
        {this.state.isModalOpen ? (
          <Modal onEsc={this.close}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <h2>
                  <Message>spawnAutoBudgetPromptTitle</Message>
                </h2>
                <br/>
                <p style={{maxWidth: '30em', margin: '2em auto', textAlign: 'center'}}>
                  <Message html>spawnAutoBudgetPromptBody</Message>
                </p>

                <br/>
                <hr/>

                <Button className='mdl-button mdl-button--accent' onClick={this.close}>
                  <Message>cancel</Message>
                </Button>

                <Button className='mdl-button' onClick={this.confirm}>
                  <Message>manuallyRunAutoBudget</Message>
                </Button>
              </div>
            </div>
          </Modal>
        ) : null}
      </Button>
    )
  }
}

export default OrderSpawnAutoBudget
