import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import filter from 'lodash/filter'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import concat from 'lodash/concat'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../../higher-order/styled'
import {loadFolderSiteLinksAction} from '../../../../actions/load-folder-site-links'
import includes from 'lodash/includes'
import FeedItem from './FeedItem'
import without from 'lodash/without'
import unionBy from 'lodash/unionBy'

const style = csjs`
.list {
  max-height: 400px;
  overflow-y: auto;
}
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}`

const unwrap = extensions => flatten(map(filter(extensions, {type: 'SITELINK'}), 'extensions'))

class EditSiteLinks extends React.Component {
  static displayName = 'Edit-Site-Links'

  static propTypes = {
    folder: PropTypes.object,
    cancel: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    campaign: PropTypes.object
  }

  state = {
    selected: map(unwrap(this.props.campaign.details.extension), 'feedItemId')
  }

  componentDidMount () {
    const {dispatch, params} = this.props

    dispatch(loadFolderSiteLinksAction, params)
      .then(() => this.forceUpdate())
  }

  save = () => {
    return Promise.resolve()
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

  render () {
    const {campaign, folder} = this.props

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
                checked={includes(this.state.selected, item.feedItemId)}
                key={item.feedItemId}/>)}
            </div>
          </div>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditSiteLinks, style)
