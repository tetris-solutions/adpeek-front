import React from 'react'
import Modal from './Modal'
import Message from '@tetris/front-server/lib/components/intl/Message'
import isFunction from 'lodash/isFunction'

const requiredContext = ['tree', 'messages', 'locales']
const {PropTypes} = React

const ReportEditPrompt = React.createClass({
  displayName: 'Report-Edit-Prompt',
  getInitialState () {
    return {
      isModalOpen: false
    }
  },
  propTypes: {
    report: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  },
  contextTypes: {
    router: PropTypes.object
  },
  open () {
    this.setState({isModalOpen: true})
  },
  close (fn) {
    this.setState({isModalOpen: false},
      isFunction(fn) ? fn : undefined)
  },
  cloneInstead () {
    this.close(() => {
      const {report, params: {company, workspace, folder}} = this.props

      this.context.router.push(`/company/${company}/workspace/${workspace}/folder/${folder}/reports/new?clone=${report.id}&name=${report.name}`)
    })
  },
  confirm () {
    this.close(() => {
      const {params: {company, workspace, folder, report}} = this.props

      this.context.router.push(`/company/${company}/workspace/${workspace}/folder/${folder}/report/${report}/edit`)
    })
  },
  render () {
    const {report} = this.props

    return (
      <a className='mdl-navigation__link' onClick={this.open}>
        <i className='material-icons'>create</i>
        <Message>editReport</Message>
        {this.state.isModalOpen ? (
          <Modal provide={requiredContext} onEscPress={this.close}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <h2>
                  <Message>editReportPromptTitle</Message>
                </h2>
                <br/>
                <p style={{maxWidth: '20em', margin: '2em auto', textAlign: 'center'}}>
                  <Message html name={report.name}>editReportPromptBody</Message>
                </p>
                <br/>
                <hr/>

                <button className='mdl-button mdl-js-button mdl-button--accent' type='button' onClick={this.close}>
                  <Message>cancel</Message>
                </button>

                <button
                  type='button'
                  className='mdl-button mdl-js-button mdl-button--primary'
                  onClick={this.cloneInstead}>
                  <Message>cloneReport</Message>
                </button>

                <button type='button' className='mdl-button mdl-js-button' onClick={this.confirm}>
                  <Message>editReport</Message>
                </button>
              </div>
            </div>
          </Modal>
        ) : null}
      </a>
    )
  }
})

export default ReportEditPrompt
