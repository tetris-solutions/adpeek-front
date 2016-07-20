import React from 'react'
import Edit from './ReportModuleEdit'
import Modal from './Modal'
import ReportChart from './ReportChart'
import reportType from '../propTypes/report'
import assign from 'lodash/assign'

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
  propTypes: assign({
    editable: PropTypes.bool,
    remove: PropTypes.func,
    update: PropTypes.func,
    reportParams: PropTypes.shape({
      ad_account: PropTypes.string,
      tetris_account: PropTypes.string,
      platform: PropTypes.string,
      from: PropTypes.string,
      to: PropTypes.string
    })
  }, reportType),
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
    const {id, editable, type, dimensions, entity, filters} = this.props

    return (
      <div className='mdl-card mdl-shadow--2dp' style={{width: '100%'}}>
        <div className='mdl-card__title mdl-card--expand'>
          <ReportChart
            dimensions={dimensions}
            id={id}
            type={type}
            entity={entity}
            filters={filters}
            reportParams={this.props.reportParams}/>
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
              dimensions={dimensions}
              id={id}
              type={type}
              entity={entity}
              filters={filters}
              save={this.save}
              cancel={this.closeModal}/>

          </Modal>
        )}
      </div>
    )
  }
})

export default ReportModule
