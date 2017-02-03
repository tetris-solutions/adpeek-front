import React from 'react'
import Message from 'tetris-iso/Message'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import moment from 'moment'
import Input from '../Input'
import clipboard from 'copy-to-clipboard'
import {loadReportShareUrlAction} from '../../actions/load-report-share-url'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {Button} from '../Button'
import {MenuItem} from '../DropdownMenu'

const ShareDialog = React.createClass({
  displayName: 'Share-Dialog',
  propTypes: {
    id: React.PropTypes.string.isRequired,
    shareUrl: React.PropTypes.string,
    close: React.PropTypes.func.isRequired
  },
  contextTypes: {
    tree: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    messages: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {isLoading: true}
  },
  componentDidMount () {
    this.load()
  },
  load () {
    const {params, location, tree} = this.context
    const to = location.query.to || moment().subtract(1, 'day').format('YYYY-MM-DD')
    const from = location.query.from || moment(to).subtract(30, 'days').format('YYYY-MM-DD')

    loadReportShareUrlAction(tree, params, this.props.id, {from, to})
      .then(() => this.setState({isLoading: false}))
  },
  copy () {
    const {tree, messages} = this.context

    clipboard(this.props.shareUrl)

    pushSuccessMessageAction(tree, messages.copySuccess)
  },
  render () {
    const {shareUrl, close} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h3>
            <Message>shareReportTitle</Message>
          </h3>

          <br/>

          <div style={{textAlign: 'center'}}>
            <Input
              name='shareUrl'
              label='shareReport'
              value={this.state.isLoading ? '...' : shareUrl}
              disabled={!shareUrl}/>
          </div>

          <br/>
          <br/>
          <hr/>

          <Button className='mdl-button' onClick={this.copy}>
            <Message>copyToClipboard</Message>
          </Button>
          <Button className='mdl-button' onClick={close}>
            <Message>close</Message>
          </Button>
        </div>
      </div>
    )
  }
})

const MenuShare = props => <MenuItem {...props} icon='share'/>

const ShareButton = props => (
  <ButtonWithPrompt tag={MenuShare} label={<Message>shareReportButton</Message>}>
    {({dismiss}) =>
      <ShareDialog
        {...props}
        close={dismiss}/>}
  </ButtonWithPrompt>
)

ShareButton.displayName = 'Share-Button'
ShareButton.propTypes = {
  shareUrl: React.PropTypes.string
}

export default ShareButton
