import React from 'react'
import Modal from './Modal'

const {PropTypes} = React

const ButtonWithPrompt = React.createClass({
  displayName: 'Button-With-Prompt',
  propTypes: {
    children: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    label: PropTypes.node,
    size: PropTypes.string
  },
  getInitialState () {
    return {
      isModalOpen: false
    }
  }, openModal () {
    this.setState({isModalOpen: true})
  },
  closeModal () {
    this.setState({isModalOpen: false})
  },
  onClick (e) {
    e.preventDefault()
    this.openModal()
  },
  render () {
    const {className, size, label, children: fn} = this.props

    return (
      <a className={className} onClick={this.onClick} href=''>
        {label}
        {this.state.isModalOpen && (
          <Modal size={size} onEscPress={this.closeModal}>
            {fn({dismiss: this.closeModal})}
          </Modal>)}
      </a>
    )
  }
})

export default ButtonWithPrompt
