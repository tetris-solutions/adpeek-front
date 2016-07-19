import React from 'react'
import pick from 'lodash/pick'
import Modal from './Modal'
import Select from './Select'

const {PropTypes} = React

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  propTypes: {
    cancel: PropTypes.func
  },
  getInitialState () {
    return pick(this.props, 'type', 'dimensions')
  },
  onChangeType ({target: {value}}) {
    this.setState({type: value})
  },
  handleSubmit (e) {
    e.preventDefault()
  },
  render () {
    const {type} = this.state
    return (
      <Modal size='large' provide={['messages', 'locales', 'insertCss']}>
        <h4>Edit module</h4>
        <form onSubmit={this.handleSubmit}>

          <Select label='moduleType' name='type' onChange={this.onChangeType}>
            <option value=''>-- select --</option>
            <option value='line'>Line</option>
            <option value='column'>Column</option>
            <option value='table'>Table</option>
          </Select>
          <br/>
          <a className='mdl-button' onClick={this.props.cancel}>
            cancel
          </a>
          <button className='mdl-button' disabled={type === null}>
            save
          </button>
        </form>
      </Modal>
    )
  }
})

export default ModuleEdit
