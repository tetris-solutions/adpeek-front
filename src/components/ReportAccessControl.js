import React from 'react'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {openReportAction} from '../actions/open-report'
import {setFolderReportAction} from '../actions/set-folder-report'
import {updateReportAction} from '../actions/update-report'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import Fence from './Fence'

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

function Options ({user, report, makePublic, unlock, setAsFolderDefault, close, canEditFolder}) {
  const setAsDefaultDescription = report.is_default_report
    ? <Message>uncheckFolderReportDescription</Message>
    : <Message>checkFolderReportDescription</Message>

  const setAsDefaultCallToAction = report.is_default_report
    ? <Message>uncheckFolderReport</Message>
    : <Message>checkFolderReport</Message>

  const showMakeGlobal = user.is_admin && !report.is_global
  const showMakePublic = report.is_private
  const showMakeDefault = canEditFolder && !report.is_private
  const noPossibleOptions = !(showMakeGlobal || showMakeDefault || showMakePublic)

  return (
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <h2>
          <Message>reportAccessControl</Message>
        </h2>

        <br/>

        {noPossibleOptions && (
          <p style={{fontSize: 'large', textAlign: 'center', margin: '2em auto', width: '20em'}}>
            <Message>emptyAccessControlOptions</Message>
          </p>)}

        {showMakeGlobal && (
          <CardButton
            description={<Message>makeReportGlobalDescription</Message>}
            icon='public'
            callToAction={<Message>makeReportGlobal</Message>}
            onClick={makePublic}/>)}

        {showMakePublic && (
          <CardButton
            disabled={!report.is_private}
            description={<Message>makeReportPublicDescription</Message>}
            icon='lock_outline'
            callToAction={<Message>makeReportPublic</Message>}
            onClick={unlock}/>)}

        {showMakeDefault && (
          <CardButton
            description={setAsDefaultDescription}
            icon={report.is_default_report ? 'indeterminate_check_box' : 'check_box'}
            callToAction={setAsDefaultCallToAction}
            onClick={setAsFolderDefault}/>)}

        <br/>
        <hr/>

        <button className='mdl-button mdl-button--accent' type='button' onClick={close}>
          <Message>cancel</Message>
        </button>
      </div>
    </div>
  )
}

Options.displayName = 'Options'
Options.propTypes = {
  user: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
  makePublic: PropTypes.func.isRequired,
  unlock: PropTypes.func.isRequired,
  setAsFolderDefault: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  canEditFolder: PropTypes.bool.isRequired
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
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  },
  componentWillMount () {
    const {dispatch, reload, report, params} = this.props

    this.makePublic = () =>
      dispatch(openReportAction, params, report.id)
        .then(reload)

    this.setAsFolderDefault = () =>
      dispatch(setFolderReportAction, params.folder, report.id)
        .then(reload)

    this.unlock = () =>
      dispatch(updateReportAction, params, {id: report.id, is_private: false})
  },
  open () {
    this.setState({isModalOpen: true})
  },
  close () {
    this.setState({isModalOpen: false})
  },
  render () {
    const {report, user, className, children} = this.props

    return (
      <a className={className} onClick={this.open}>
        {children}
        <Message>reportAccessControl</Message>
        {this.state.isModalOpen ? (
          <Modal size='large' onEscPress={this.close}>
            <Fence canEditFolder>{({canEditFolder}) => (
              <Options
                canEditFolder={canEditFolder}
                setAsFolderDefault={this.setAsFolderDefault}
                unlock={this.unlock}
                makePublic={this.makePublic}
                close={this.close}
                report={report}
                user={user}/>)}
            </Fence>
          </Modal>
        ) : null}
      </a>
    )
  }
})

export default ReportAccessControl
