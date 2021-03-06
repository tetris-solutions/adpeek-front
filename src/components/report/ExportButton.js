import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import Message from '@tetris/front-server/Message'
import {styledFunctionalComponent} from '../higher-order/styled'
import csjs from 'csjs'
import {many} from '../higher-order/branch'
import {inferLevelFromProps} from '../../functions/infer-level-from-params'
import get from 'lodash/get'
import some from 'lodash/some'
import {Button} from '../Button'
import {MenuItem} from '../DropdownMenu'

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
      <span className={style.icon}>
        <i className='material-icons mdl-color-text--grey-600'>{icon}</i>
      </span>
    </div>
    <div className='mdl-card__actions mdl-card--border'>
      <Button onClick={onClick} className='mdl-button mdl-button--colored'>
        {children}
      </Button>
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
      <div className={style.cards}>
        <Format icon='border_clear' onClick={xls}>
          <Message>reportTypeSpreadsheet</Message>
        </Format>
        <Format icon='insert_drive_file' onClick={pdf}>
          <Message>reportTypePdf</Message>
        </Format>
      </div>
      <br/>
      <hr/>
      <Button className='mdl-button mdl-button--accent' onClick={cancel}>
        <Message>cancel</Message>
      </Button>
    </div>
  </div>
)

ExportOptions.displayName = 'Pick-Type'
ExportOptions.propTypes = {
  xls: PropTypes.func.isRequired,
  pdf: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}
const PickType = styledFunctionalComponent(ExportOptions, style)

const notReady = ({isLoading, result}) => isLoading || !result

class ReportExportButton extends React.Component {
  static displayName = 'Report-Export-Button'

  static propTypes = {
    cursors: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    isCreatingReport: PropTypes.bool.isRequired
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  state = {
    isModalOpen: false,
    waiting: false
  }

  getReportMetaData = () => {
    return {
      folder: get(this.props, 'folder.name'),
      workspace: get(this.props, 'workspace.name'),
      company: get(this.props, 'company.name'),
      icon: get(this.props, 'company.icon'),
      url: window.location.href,
      from: get(this.context, 'location.query.from'),
      to: get(this.context, 'location.query.to')
    }
  }

  exportAsPdf = () => {
    this.export('pdf', this.getReportMetaData())
    this.close()
  }

  exportAsXls = () => {
    this.export('xls', this.getReportMetaData())
    this.close()
  }

  open = () => {
    this.setState({isModalOpen: true})
  }

  close = () => {
    this.setState({isModalOpen: false})
  }

  export = (type, metaData) => {
    const {report: {modules}} = this.props.cursors
    const stillLoading = some(modules, notReady)

    if (stillLoading) {
      clearTimeout(this.timeout)
      this.setState({isWaiting: true})
      setTimeout(() => this.export(type, metaData), 500)
    } else {
      this.setState({isWaiting: false})
      this.props.create(type, metaData)
    }
  }

  render () {
    const isLoading = this.props.isCreatingReport || this.state.isWaiting

    return (
      <MenuItem
        persist
        icon='file_download'
        disabled={isLoading}
        onClick={this.open}>

        {isLoading
          ? <Message>creatingReport</Message>
          : <Message>extractReport</Message>}

        {this.state.isModalOpen && (
          <Modal onEscPress={this.close}>
            <PickType xls={this.exportAsXls} pdf={this.exportAsPdf} cancel={this.close}/>
          </Modal>)}
      </MenuItem>
    )
  }
}

export default many([
  ['user', 'company'],
  ['company', 'workspace'],
  ['workspace', 'folder'],
  [inferLevelFromProps, 'report']
], ReportExportButton)
