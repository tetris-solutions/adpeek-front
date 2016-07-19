import React from 'react'
import Edit from './ReportModuleEdit'

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
      'line'
    ]),
    editable: PropTypes.bool,
    entity: PropTypes.object,
    dimensions: PropTypes.array,
    filter: PropTypes.shape({
      id: PropTypes.array
    }),
    removeModule: PropTypes.func
  },
  openModal () {
    this.setState({editMode: true})
  },
  closeModal () {
    this.setState({editMode: false})
  },
  remove () {
    this.props.removeModule(this.props.id)
  },
  render () {
    const {editMode} = this.state
    const {editable} = this.props

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

        {editable && (/* type === null || */editMode === true) && (
          <Edit {...this.props} cancel={this.closeModal}/>
        )}
      </div>
    )
  }
})

export default ReportModule
