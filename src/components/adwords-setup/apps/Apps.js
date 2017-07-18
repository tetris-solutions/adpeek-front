import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import filter from 'lodash/filter'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import concat from 'lodash/concat'
import Form from '../../Form'
import {Button, Submit} from '../../Button'
import {styledComponent} from '../../higher-order/styled'
import {loadFolderAppsAction} from '../../../actions/load-folder-apps'
import {updateCampaignAppsAction} from '../../../actions/update-campaign-apps'
import {updateAccountAppsAction} from '../../../actions/update-account-apps'
import Checkbox from '../../Checkbox'
import includes from 'lodash/includes'
import without from 'lodash/without'
import unionBy from 'lodash/unionBy'
import {style} from '../../campaign/edit/style'
import NewApp from './NewApp'
import get from 'lodash/get'
import head from 'lodash/head'

const unwrap = extensions => flatten(map(filter(extensions, {type: 'APP'}), 'extensions'))

const actions = {
  campaign: updateCampaignAppsAction,
  account: updateAccountAppsAction
}

class EditApp extends React.Component {
  static displayName = 'Edit-App'

  static propTypes = {
    level: PropTypes.oneOf(['account', 'campaign', 'adGroup']),
    dispatch: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    extensions: PropTypes.array.isRequired,
    cancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.loadFolderApps()
  }

  loadFolderApps = () => {
    const {dispatch, params} = this.props

    return dispatch(loadFolderAppsAction, params)
      .then(() => this.forceUpdate())
  }

  getCampaignAppExtensions = () => {
    return map(unwrap(this.props.extensions), 'feedItemId')
  }

  state = {
    openCreateModal: false,
    selected: this.getCampaignAppExtensions()
  }

  toggleModal = () => {
    this.setState({
      openCreateModal: !this.state.openCreateModal
    })
  }

  add = id => {
    this.setState({
      selected: concat(this.state.selected, id)
    })
  }

  remove = id => {
    this.setState({
      selected: without(this.state.selected, id)
    })
  }

  onCheck = ({target: {checked, value: id}}) => {
    if (checked) {
      this.add(id)
    } else {
      this.remove(id)
    }
  }

  save = () => {
    const {onSubmit, level, dispatch, params, folder} = this.props
    const apps = filter(folder.apps,
      ({feedItemId}) => includes(this.state.selected, feedItemId))

    return dispatch(actions[level], params, apps)
      .then(onSubmit)
  }

  render () {
    const {selected, openCreateModal} = this.state
    const {dispatch, params, cancel, extensions, folder} = this.props
    const apps = unionBy(
      unwrap(extensions),
      folder.apps,
      'feedItemId'
    )

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-list ${style.list}`}>{map(apps, ({feedItemId, appLinkText, appFinalUrls: {urls}}) =>
              <div key={feedItemId} className='mdl-list__item'>
                <a href={head(urls)} target='_blank' className='mdl-list__item-primary-content'>
                  {appLinkText}
                </a>
                <span className='mdl-list__item-secondary-action'>
                  <Checkbox
                    name={`app-${feedItemId}`}
                    value={feedItemId}
                    onChange={this.onCheck}
                    checked={includes(selected, feedItemId)}/>
                </span>
              </div>)}
            </div>
          </div>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={cancel}>
            <Message>cancel</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
            <Message>newApp</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>

        {openCreateModal && (
          <Modal onEscPress={this.toggleModal}>
            <NewApp
              {...{folder, dispatch, params}}
              feedId={get(head(apps), 'feedId')}
              cancel={this.toggleModal}
              onSubmit={this.toggleModal}/>
          </Modal>)}
      </Form>
    )
  }
}

export default styledComponent(EditApp, style)
