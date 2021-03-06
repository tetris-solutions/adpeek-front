import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import Message from '@tetris/front-server/Message'
import {openReportAction} from '../../actions/open-report'
import {setDefaultReportAction} from '../../actions/set-default-report'
import {updateReportAction} from '../../actions/update-report'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'
import {branch, many} from '../higher-order/branch'
import Fence from '../Fence'
import {inferLevelFromParams, inferLevelFromProps} from '../../functions/infer-level-from-params'
import {Button} from '../Button'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import {loadReportAction} from '../../actions/load-report'
import map from 'lodash/map'
import find from 'lodash/find'

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
}
.empty {
  font-size: large;
  text-align: center;
  margin: 2em auto;
  width: 20em;
}`

const CallToAction = ({children, onClick}) => (
  <a className={`${style.button} mdl-button`} onClick={onClick}>
    <Message>{children}</Message>
  </a>
)

CallToAction.displayName = 'Call-To-Action'
CallToAction.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func
}

let MediaSelector = ({selected, setMedia, medias}) =>
  <a className={`${style.button} mdl-button`}>
    {selected
      ? find(medias, {id: selected}).name
      : <Message>setReportMedia</Message>}

    <DropdownMenu>{map(medias, ({id, name}, index) =>
      <MenuItem key={index} onClick={() => setMedia(id)}>
        {name}
      </MenuItem>)}
    </DropdownMenu>
  </a>

MediaSelector.displayName = 'Media-Selector'
MediaSelector.propTypes = {
  selected: PropTypes.string,
  setMedia: PropTypes.func,
  medias: PropTypes.array
}
MediaSelector = branch('medias', MediaSelector)

function CardButton ({button, icon, description}) {
  return (
    <div className={`${style.card} mdl-card mdl-shadow--2dp`}>
      <div className={`${style.title} mdl-card__title mdl-card--expand`}>
        <h5>
          {description}
        </h5>
      </div>
      <div className={`${style.actions} mdl-card__actions mdl-card--border`}>
        {button}
        <div className='mdl-layout-spacer'/>
        <i className='material-icons'>{icon}</i>
      </div>
    </div>
  )
}

CardButton.displayName = 'Card-Button'
CardButton.propTypes = {
  button: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired
}

function Options ({user, report, setMedia, makePublic, unlock, setAsDefault, close, canEdit}) {
  const setAsDefaultDescription = report.is_default_report
    ? <Message>uncheckDefaultReportDescription</Message>
    : <Message>checkDefaultReportDescription</Message>

  const setAsDefaultCallToAction = report.is_default_report
    ? 'uncheckDefaultReport'
    : 'checkDefaultReport'

  const showMakeGlobal = user.is_admin && !report.is_global
  const showSetMedia = report.level === 'folder' && report.is_global && user.is_admin
  const showMakePublic = report.is_private
  const showMakeDefault = canEdit && !report.is_private
  const noPossibleOptions = !(showMakeGlobal || showMakeDefault || showMakePublic)

  return (
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <h2>
          <Message>reportAccessControl</Message>
        </h2>

        <br/>

        {noPossibleOptions && (
          <p className={style.empty}>
            <Message>emptyAccessControlOptions</Message>
          </p>)}

        {showMakeGlobal && (
          <CardButton
            description={<Message>makeReportGlobalDescription</Message>}
            icon='public'
            button={<CallToAction onClick={makePublic}>makeReportGlobal</CallToAction>}/>)}

        {showSetMedia && (
          <CardButton
            description={<Message>setReportMediaDescription</Message>}
            icon='perm_media'
            button={<MediaSelector selected={report.media} setMedia={setMedia}/>}/>)}

        {showMakePublic && (
          <CardButton
            disabled={!report.is_private}
            description={<Message>makeReportPublicDescription</Message>}
            icon='lock_outline'
            button={<CallToAction onClick={unlock}>makeReportPublic</CallToAction>}/>)}

        {showMakeDefault && (
          <CardButton
            description={setAsDefaultDescription}
            icon={report.is_default_report ? 'indeterminate_check_box' : 'check_box'}
            button={<CallToAction onClick={setAsDefault}>{setAsDefaultCallToAction}</CallToAction>}/>)}

        <br/>
        <hr/>

        <Button className='mdl-button mdl-button--accent' onClick={close}>
          <Message>cancel</Message>
        </Button>
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
  setMedia: PropTypes.func.isRequired,
  setAsDefault: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired
}

class ReportAccessControl extends React.Component {
  static displayName = 'Report-Access-Control'

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  state = {
    isModalOpen: false
  }

  componentWillMount () {
    const {dispatch, report, params} = this.props

    this.makePublic = () =>
      dispatch(openReportAction, params, report.id)
        .then(this.reload)

    this.setAsDefault = () =>
      dispatch(setDefaultReportAction, params, report.id)
        .then(this.reload)

    this.unlock = () =>
      dispatch(updateReportAction, params, {id: report.id, is_private: false})

    this.setMedia = media =>
      dispatch(updateReportAction, params, {id: report.id, media})
  }

  open = () => {
    this.setState({isModalOpen: true})
  }

  close = () => {
    this.setState({isModalOpen: false})
  }

  reload = () => {
    const {params, dispatch, report} = this.props

    return dispatch(loadReportAction, params, report.id)
  }

  render () {
    const {report, user, params} = this.props
    const level = inferLevelFromParams(params)

    const canEditPermission = level === 'folder'
      ? 'canEditFolder'
      : 'canEditWorkspace' // @todo how to check for company edit permission??

    const fencePerms = {[canEditPermission]: true}

    return (
      <MenuItem icon='visibility' onClick={this.open} persist>
        <Message>reportAccessControl</Message>
        {this.state.isModalOpen ? (
          <Modal onEscPress={this.close}>
            <Fence {...fencePerms}>{permissions => (
              <Options
                canEdit={permissions[canEditPermission]}
                setAsDefault={this.setAsDefault}
                setMedia={this.setMedia}
                unlock={this.unlock}
                makePublic={this.makePublic}
                close={this.close}
                report={report}
                user={user}/>)}
            </Fence>
          </Modal>) : null}
      </MenuItem>
    )
  }
}

export default many([
  {user: ['user']},
  [inferLevelFromProps, 'report']
], styledComponent(ReportAccessControl, style))
