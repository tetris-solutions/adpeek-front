import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import filter from 'lodash/filter'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import concat from 'lodash/concat'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {styledComponent} from '../../../higher-order/styled'
import {loadFolderSiteLinksAction} from '../../../../actions/load-folder-site-links'
import {updateCampaignSiteLinksAction} from '../../../../actions/update-campaign-site-links'
import includes from 'lodash/includes'
import FeedItem from './FeedItem'
import without from 'lodash/without'
import unionBy from 'lodash/unionBy'
import Modal from 'tetris-iso/Modal'
import NewSiteLink from './NewSiteLink'
import {style} from '../style'

const unwrap = extensions => flatten(map(filter(extensions, {type: 'SITELINK'}), 'extensions'))

class EditSiteLinks extends React.Component {
  static displayName = 'Edit-Site-Links'

  static propTypes = {
    folder: PropTypes.object,
    cancel: PropTypes.func,
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    campaign: PropTypes.object
  }

  componentDidMount () {
    this.loadFolderSiteLinks()
  }

  loadFolderSiteLinks = () => {
    const {dispatch, params} = this.props

    dispatch(loadFolderSiteLinksAction, params)
      .then(() => this.forceUpdate())
  }

  save = () => {
    const {onSubmit, dispatch, params, folder} = this.props
    const siteLinks = filter(folder.siteLinks,
      ({feedItemId}) => includes(this.state.selected, feedItemId))

    return dispatch(updateCampaignSiteLinksAction, params, siteLinks)
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
    return map(unwrap(this.props.campaign.details.extension), 'feedItemId')
  }

  state = {
    openCreateModal: false,
    selected: this.getCampaignSiteLinkExtensions()
  }

  toggleModal = () => {
    this.setState({openCreateModal: !this.state.openCreateModal})
  }

  reloadList = () => {
    this.loadFolderSiteLinks()
      .then(this.toggleModal)
  }

  render () {
    const {selected, openCreateModal} = this.state
    const {cancel, campaign, folder} = this.props
    const ls = unionBy(
      unwrap(campaign.details.extension),
      folder.siteLinks,
      'feedItemId'
    )

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-list ${style.list}`}>{map(ls, item =>
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
          <Modal size='small' onEscPress={this.toggleModal}>
            <NewSiteLink
              cancel={this.toggleModal}
              onSubmit={this.reloadList}/>
          </Modal>)}
      </Form>
    )
  }
}

export default styledComponent(EditSiteLinks, style)
