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
import {loadFolderSiteLinksAction} from '../../../actions/load-folder-site-links'
import {updateCampaignSiteLinksAction} from '../../../actions/update-campaign-site-links'
import {updateAdGroupSiteLinksAction} from '../../../actions/update-adgroup-site-links'
import includes from 'lodash/includes'
import FeedItem from './FeedItem'
import without from 'lodash/without'
import unionBy from 'lodash/unionBy'
import Modal from 'tetris-iso/Modal'
import NewSiteLink from './NewSiteLink'
import {style} from '../../campaign/edit/style'
import get from 'lodash/get'
import head from 'lodash/head'
import isEmpty from 'lodash/isEmpty'

const unwrap = extensions => flatten(map(filter(extensions, {type: 'SITELINK'}), 'extensions'))
const actions = {
  campaign: updateCampaignSiteLinksAction,
  adGroup: updateAdGroupSiteLinksAction
}

const isValidSiteLink = item => (
  !isEmpty(item.sitelinkText) &&
  !isEmpty(item.sitelinkLine2) &&
  !isEmpty(item.sitelinkLine3) &&
  !isEmpty(item.sitelinkFinalUrls)
)

class EditSiteLinks extends React.Component {
  static displayName = 'Edit-Site-Links'

  static propTypes = {
    level: PropTypes.oneOf(['campaign', 'adGroup']),
    folder: PropTypes.object,
    cancel: PropTypes.func,
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    extension: PropTypes.array
  }

  componentDidMount () {
    this.loadFolderSiteLinks()
  }

  loadFolderSiteLinks = () => {
    const {dispatch, params} = this.props

    return dispatch(loadFolderSiteLinksAction, params)
      .then(() => this.forceUpdate())
  }

  save = () => {
    const {onSubmit, level, dispatch, params, folder} = this.props
    const siteLinks = filter(folder.siteLinks,
      ({feedItemId}) => includes(this.state.selected, feedItemId))

    return dispatch(actions[level], params, siteLinks)
      .then(onSubmit)
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

  getCampaignSiteLinkExtensions = () => {
    return map(unwrap(this.props.extension), 'feedItemId')
  }

  state = {
    openCreateModal: false,
    selected: this.getCampaignSiteLinkExtensions()
  }

  toggleModal = () => {
    this.setState({
      openCreateModal: !this.state.openCreateModal
    })
  }

  render () {
    const {selected, openCreateModal} = this.state
    const {cancel, extension, folder, dispatch, params} = this.props
    const siteLinks = filter(unionBy(
      unwrap(extension),
      folder.siteLinks,
      'feedItemId'
    ), isValidSiteLink)

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-list ${style.list}`}>{map(siteLinks, item =>
              <FeedItem
                {...item}
                add={this.add}
                remove={this.remove}
                checked={includes(selected, item.feedItemId)}
                key={item.feedItemId}/>)}
            </div>
          </div>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={cancel}>
            <Message>cancel</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
            <Message>newSiteLink</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>

        {openCreateModal && (
          <Modal onEscPress={this.toggleModal}>
            <NewSiteLink
              {...{folder, dispatch, params}}
              feedId={get(head(siteLinks), 'feedId')}
              cancel={this.toggleModal}
              onSubmit={this.toggleModal}/>
          </Modal>)}
      </Form>
    )
  }
}

export default styledComponent(EditSiteLinks, style)
