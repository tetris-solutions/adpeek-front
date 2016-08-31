import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import Modal from './Modal'

const {PropTypes} = React

function Prompt ({entityName, onConfirm, onCancel}) {
  return (
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <h2>
          <Message>deletePromptTitle</Message>
        </h2>
        <br/>
        <p style={{textAlign: 'center'}}>
          <Message html entityName={entityName}>deletePromptBody</Message>
        </p>
        <br/>
        <hr/>
        <button className='mdl-button mdl-js-button mdl-button--accent' type='button' onClick={onCancel}>
          <Message>cancel</Message>
        </button>
        <button className='mdl-button mdl-js-button mdl-button--primary' type='button' onClick={onConfirm}>
          <Message>remove</Message>
        </button>
      </div>
    </div>
  )
}
Prompt.displayName = 'Prompt'
Prompt.propTypes = {
  entityName: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

const requiredContext = ['tree', 'messages', 'locales']

const DeleteButton = React.createClass({
  displayName: 'Delete-Button',
  getInitialState () {
    return {
      showPrompt: false
    }
  },
  propTypes: {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    entityName: PropTypes.node.isRequired
  },
  open () {
    this.setState({showPrompt: true})
  },
  close () {
    this.setState({showPrompt: false})
  },
  confirm () {
    this.setState({showPrompt: false}, this.props.onClick)
  },
  render () {
    const {className, children, entityName} = this.props
    return (
      <a className={className} onClick={this.open}>
        {children}
        {this.state.showPrompt ? (
          <Modal size='small' provide={requiredContext} onEscPress={this.close}>
            <Prompt entityName={entityName} onConfirm={this.confirm} onCancel={this.close}/>
          </Modal>
        ) : null}
      </a>
    )
  }
})

export default DeleteButton
