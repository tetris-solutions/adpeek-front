import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import filter from 'lodash/filter'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import concat from 'lodash/concat'
import Form from '../../Form'
import {Button, Submit} from '../../Button'
import {styledComponent} from '../../higher-order/styled'
import {loadFolderCallOutsAction} from '../../../actions/load-folder-call-outs'
import {updateCampaignCallOutsAction} from '../../../actions/update-campaign-call-outs'
import {updateAdGroupCallOutsAction} from '../../../actions/update-adgroup-call-outs'
import {updateAccountCallOutsAction} from '../../../actions/update-account-call-outs'
import Checkbox from '../../Checkbox'
import includes from 'lodash/includes'
import without from 'lodash/without'
import unionBy from 'lodash/unionBy'
import Modal from 'tetris-iso/Modal'
import {style} from '../../campaign/edit/style'
import NewCallOut from './NewCallOut'
import get from 'lodash/get'
import head from 'lodash/head'

const unwrap = extensions => flatten(map(filter(extensions, {type: 'CALLOUT'}), 'extensions'))

const actions = {
  campaign: updateCampaignCallOutsAction,
  adGroup: updateAdGroupCallOutsAction,
  account: updateAccountCallOutsAction
}

class EditCallOut extends React.Component {
  static displayName = 'Edit-Call-Out'

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
    this.loadFolderCallOuts()
  }

  loadFolderCallOuts = () => {
    const {dispatch, params} = this.props

    return dispatch(loadFolderCallOutsAction, params)
      .then(() => this.forceUpdate())
  }

  getCampaignCallOutExtensions = () => {
    return map(unwrap(this.props.extensions), 'feedItemId')
  }

  state = {
    openCreateModal: false,
    selected: this.getCampaignCallOutExtensions()
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
    const callOuts = filter(folder.callOuts,
      ({feedItemId}) => includes(this.state.selected, feedItemId))

    return dispatch(actions[level], params, callOuts)
      .then(onSubmit)
  }

  render () {
    const {selected, openCreateModal} = this.state
    const {dispatch, params, cancel, extensions, folder} = this.props
    const callOuts = unionBy(
      unwrap(extensions),
      folder.callOuts,
      'feedItemId'
    )

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-list ${style.list}`}>{map(callOuts, ({feedItemId, calloutText}) =>
              <div key={feedItemId} className='mdl-list__item'>
                <span className='mdl-list__item-primary-content'>
                  {calloutText}
                </span>
                <span className='mdl-list__item-secondary-action'>
                  <Checkbox
                    name={`call-out-${feedItemId}`}
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
            <Message>newCallOut</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>

        {openCreateModal && (
          <Modal onEscPress={this.toggleModal}>
            <NewCallOut
              {...{folder, dispatch, params}}
              feedId={get(head(callOuts), 'feedId')}
              cancel={this.toggleModal}
              onSubmit={this.toggleModal}/>
          </Modal>)}
      </Form>
    )
  }
}

export default styledComponent(EditCallOut, style)
