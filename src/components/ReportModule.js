import React from 'react'
import Edit from './ReportModuleEdit'
import Modal from './Modal'

const {PropTypes} = React

const ReportModule = React.createClass({
  displayName: 'Report-Module',
  getDefaultProps () {
    return {
      editable: false
    }
  },
  getInitialState () {
    return {
      editMode: false
    }
  },
  propTypes: {
    id: PropTypes.string,
    type: PropTypes.oneOf([
      'line',
      'column',
      'pie',
      'table'
    ]),
    editable: PropTypes.bool,
    entity: PropTypes.object,
    dimensions: PropTypes.array,
    filter: PropTypes.shape({
      id: PropTypes.array
    }),
    remove: PropTypes.func,
    update: PropTypes.func
  },
  openModal () {
    this.setState({editMode: true})
  },
  closeModal () {
    this.setState({editMode: false})
  },
  remove () {
    this.props.remove(this.props.id)
  },
  save (updatedModule) {
    this.closeModal()
    this.props.update(
      this.props.id,
      updatedModule
    )
  },
  render () {
    const {editMode} = this.state
    const {editable, type} = this.props

    return (
      <div className='mdl-card mdl-shadow--2dp' style={{width: '100%'}}>
        <div className='mdl-card__title mdl-card--expand'>
          <img src='/contrived-graph.png'/>
        </div>

        {editable && (
          <div className='mdl-card__menu'>
            <button
              className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
              onClick={this.openModal}>

              <i className='material-icons'>create</i>
            </button>
            <button
              className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
              onClick={this.remove}>

              <i className='material-icons'>clear</i>
            </button>
          </div>
        )}

        {editable && (type === null || editMode === true) && (
          <Modal
            size='large'
            provide={['messages', 'locales', 'insertCss']}
            onEscPress={type !== null ? this.closeModal : undefined}>

            <Edit
              {...this.props}
              save={this.save}
              cancel={this.closeModal}/>

          </Modal>
        )}
      </div>
    )
  }
})

export default ReportModule
