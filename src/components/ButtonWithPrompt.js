import React from 'react'
import Modal from 'tetris-iso/Modal'

const {PropTypes} = React
const st = {cursor: 'pointer'}
const ButtonWithPrompt = React.createClass({
  displayName: 'Button-With-Prompt',
  propTypes: {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    label: PropTypes.node.isRequired,
    size: PropTypes.string,
    span: PropTypes.bool
  },
  getInitialState () {
    return {
      isModalOpen: false
    }
  },
  getDefaultProps () {
    return {
      size: 'small'
    }
  },
  openModal () {
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
    const {span, className, size, label, children: fn} = this.props
    const props = {className, onClick: this.onClick, style: st}
    let Tag = 'button'

    if (span) {
      Tag = 'span'
    } else {
      props.type = 'button'
    }

    return (
      <Tag {...props}>
        {label}
        {this.state.isModalOpen && (
          <Modal size={size} onEscPress={this.closeModal}>
            {fn({dismiss: this.closeModal})}
          </Modal>)}
      </Tag>
    )
  }
})

export default ButtonWithPrompt
