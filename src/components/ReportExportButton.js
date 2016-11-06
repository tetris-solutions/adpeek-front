import React from 'react'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {styledFnComponent} from './higher-order/styled-fn-component'
import csjs from 'csjs'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'

const {PropTypes} = React
const style = csjs`
.cards > div {
  display: inline-block;
  margin-left: 10px;
}
.icon {
  margin: 0 auto;
}
.icon > i {
  font-size: 64px;
  margin: .5em 0;
}`

const Format = ({icon, onClick, children}) => (
  <div className='mdl-card mdl-shadow--2dp'>
    <div className='mdl-card__title mdl-card--expand'>
      <span className={String(style.icon)}>
        <i className='material-icons mdl-color-text--grey-600'>{icon}</i>
      </span>
    </div>
    <div className='mdl-card__actions mdl-card--border'>
      <button type='button' onClick={onClick} className='mdl-button mdl-button--colored'>
        {children}
      </button>
    </div>
  </div>
)

Format.displayName = 'Format'
Format.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

const ExportOptions = ({pdf, xls, cancel}) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--12-col'>
      <h2>
        <Message>pickReportTypePromptTitle</Message>
      </h2>
      <br/>
      <div className={String(style.cards)}>
        <Format icon='border_clear' onClick={xls}>
          <Message>reportTypeSpreadsheet</Message>
        </Format>
        <Format icon='insert_drive_file' onClick={pdf}>
          <Message>reportTypePdf</Message>
        </Format>
      </div>
      <br/>
      <hr/>
      <button className='mdl-button mdl-button--accent' type='button' onClick={cancel}>
        <Message>cancel</Message>
      </button>
    </div>
  </div>
)

ExportOptions.displayName = 'Pick-Type'
ExportOptions.propTypes = {
  xls: PropTypes.func.isRequired,
  pdf: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}
const PickType = styledFnComponent(ExportOptions, style)

const ReportExportButton = React.createClass({
  displayName: 'Report-Export-Button',
  propTypes: {
    create: PropTypes.func.isRequired,
    isCreatingReport: PropTypes.bool.isRequired
  },
  contextTypes: {
    location: PropTypes.object
  },
  getInitialState () {
    return {
      isModalOpen: false
    }
  },
  getReportMetaData () {
    return {
      folder: get(this.props, 'folder.name'),
      workspace: get(this.props, 'workspace.name'),
      company: get(this.props, 'company.name'),
      icon: get(this.props, 'company.icon'),
      url: window.location.href,
      from: get(this.context, 'location.query.from'),
      to: get(this.context, 'location.query.to')
    }
  },
  exportAsPdf () {
    this.props.create('pdf', this.getReportMetaData())
    this.close()
  },
  exportAsXls () {
    this.props.create('xls', this.getReportMetaData())
    this.close()
  },
  open () {
    this.setState({isModalOpen: true})
  },
  close () {
    this.setState({isModalOpen: false})
  },
  render () {
    const {isCreatingReport} = this.props

    return (
      <button
        type='button'
        disabled={isCreatingReport}
        className='mdl-button mdl-color-text--grey-100'
        onClick={this.open}>

        {isCreatingReport
          ? <Message>creatingReport</Message>
          : <Message>extractReport</Message>}

        {this.state.isModalOpen && (
          <Modal onEscPress={this.close}>
            <PickType xls={this.exportAsXls} pdf={this.exportAsPdf} cancel={this.close}/>
          </Modal>)}
      </button>
    )
  }
})

export default contextualize(ReportExportButton, 'company', 'folder', 'workspace')
