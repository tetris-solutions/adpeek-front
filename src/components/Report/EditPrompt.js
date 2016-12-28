import React from 'react'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import isFunction from 'lodash/isFunction'
import TextMessage from 'intl-messageformat'
import Checkbox from '../Checkbox'
import join from 'lodash/join'
import compact from 'lodash/compact'
import {Button} from '../Button'

const ReportEditPrompt = React.createClass({
  displayName: 'Report-Edit-Prompt',
  getInitialState () {
    return {
      isModalOpen: false
    }
  },
  propTypes: {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string.isRequired,
    report: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
  },
  contextTypes: {
    messages: React.PropTypes.object,
    locales: React.PropTypes.string,
    router: React.PropTypes.object
  },
  open () {
    this.setState({isModalOpen: true})
  },
  closeModalAnd (fn) {
    this.setState({isModalOpen: false},
      isFunction(fn) ? fn : undefined)
  },
  navigateToCloneForm () {
    const {router, messages, locales} = this.context
    const {report, params: {company, workspace, folder}} = this.props
    const cloneName = new TextMessage(messages.copyOfName, locales).format({name: report.name})

    const scope = join(compact([
      `company/${company}`,
      workspace && `workspace/${workspace}`,
      folder && `folder/${folder}`
    ]), '/')

    router.push(`/${scope}/reports/new?clone=${report.id}&name=${cloneName}`)
  },
  cloneInstead () {
    this.closeModalAnd(this.navigateToCloneForm)
  },
  remember () {
    try {
      const {form: {elements}} = this.refs

      if (elements.doNotAskAgain.checked) {
        window.localStorage.skipReportEditPrompt = true
      }
    } catch (e) {
      // console.error(e)
    }
  },
  navigateToEditMode () {
    const {params: {company, workspace, folder, report}} = this.props

    const scope = join(compact([
      `company/${company}`,
      workspace && `workspace/${workspace}`,
      folder && `folder/${folder}`
    ]), '/')

    this.context.router.push(`/${scope}/report/${report}/edit`)
  },
  confirm () {
    this.closeModalAnd(this.navigateToEditMode)

    this.remember()
  },
  render () {
    const {report, children, className} = this.props

    return (
      <a className={className} onClick={this.open}>
        {children}
        <Message>editReport</Message>
        {this.state.isModalOpen ? (
          <Modal onEscPress={this.closeModalAnd}>
            <form ref='form' className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <h2>
                  <Message>editReportPromptTitle</Message>
                </h2>
                <br/>
                <p style={{maxWidth: '20em', margin: '2em auto', textAlign: 'center'}}>
                  <Message html name={report.name}>editReportPromptBody</Message>
                </p>

                <Checkbox name='doNotAskAgain' label={<Message>doNotAskAgain</Message>}/>

                <br/>
                <hr/>

                <Button className='mdl-button mdl-button--accent' onClick={this.closeModalAnd}>
                  <Message>cancel</Message>
                </Button>

                <Button
                  className='mdl-button mdl-button--primary'
                  onClick={this.cloneInstead}>
                  <Message>cloneReport</Message>
                </Button>

                <Button className='mdl-button' onClick={this.confirm}>
                  <Message>editReport</Message>
                </Button>
              </div>
            </form>
          </Modal>
        ) : null}
      </a>
    )
  }
})

export default ReportEditPrompt
