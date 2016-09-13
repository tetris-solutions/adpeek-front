import React from 'react'
import Modal from './Modal'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {openReportAction} from '../actions/open-report'
import {setFolderReportAction} from '../actions/set-folder-report'
import {updateReportAction} from '../actions/update-report'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.card {
  display: inline-block;
  width: 17em;
  margin: 0 .5em;
  background: rgb(250, 250, 250)
}
.title {
  height: 10em;
  align-items: flex-start
}
.title h5 {
  margin-top: 0
}
.actions {
  display: flex;
  box-sizing:border-box;
  align-items: center;
}
.button {
  text-align: left;
}`

const requiredContext = ['tree', 'messages', 'locales']
const {PropTypes} = React

function CardButton ({callToAction, onClick, icon, description}) {
  return (
    <div className={`${style.card} mdl-card mdl-shadow--2dp`}>
      <div className={`${style.title} mdl-card__title mdl-card--expand`}>
        <h5>
          {description}
        </h5>
      </div>
      <div className={`${style.actions} mdl-card__actions mdl-card--border`}>
        <a className={`${style.button} mdl-button`} onClick={onClick}>
          {callToAction}
        </a>
        <div className='mdl-layout-spacer'/>
        <i className='material-icons'>{icon}</i>
      </div>
    </div>
  )
}
CardButton.displayName = 'Card-Button'
CardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  callToAction: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired
}

const ReportAccessControl = React.createClass({
  displayName: 'Report-Access-Control',
  mixins: [styled(style)],
  getInitialState () {
    return {
      isModalOpen: false
    }
  },
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  },
  componentWillMount () {
    const {dispatch, reload, report, params: {folder}} = this.props

    this.makePublic = () =>
      dispatch(openReportAction, report.id)
        .then(reload)

    this.setAsFolderDefault = () =>
      dispatch(setFolderReportAction, folder, report.id)
        .then(reload)

    this.unlock = () =>
      dispatch(updateReportAction, {id: report.id, is_private: false})
  },
  open () {
    this.setState({isModalOpen: true})
  },
  close () {
    this.setState({isModalOpen: false})
  },
  render () {
    const {report, user} = this.props

    return (
      <a className='mdl-navigation__link' onClick={this.open}>
        <i className='material-icons'>share</i>
        <Message>reportAccessControl</Message>
        {this.state.isModalOpen ? (
          <Modal size='large' provide={requiredContext} onEscPress={this.close}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <h2>
                  <Message>reportAccessControl</Message>
                </h2>
                <br/>

                {!report.is_global && user.is_admin ? (
                  <CardButton
                    description={<Message>makeReportGlobalDescription</Message>}
                    icon='public'
                    callToAction={<Message>makeReportGlobal</Message>}
                    onClick={this.makePublic}/>
                ) : null}

                {report.is_private ? (
                  <CardButton
                    description={<Message>makeReportPublicDescription</Message>}
                    icon='lock_outline'
                    callToAction={<Message>makeReportPublic</Message>}
                    onClick={this.unlock}/>
                ) : (
                  <CardButton
                    description={
                      <Message>{report.is_folder_report ? 'uncheckFolderReportDescription' : 'checkFolderReportDescription'}</Message>}
                    icon={report.is_folder_report ? 'indeterminate_check_box' : 'check_box'}
                    callToAction={
                      <Message>{report.is_folder_report ? 'uncheckFolderReport' : 'checkFolderReport'}</Message>}
                    onClick={this.setAsFolderDefault}/>
                )}
                <br/>
                <hr/>
                <button className='mdl-button mdl-js-button mdl-button--accent' type='button' onClick={this.close}>
                  <Message>cancel</Message>
                </button>
              </div>
            </div>
          </Modal>
        ) : null}
      </a>
    )
  }
})

export default ReportAccessControl
