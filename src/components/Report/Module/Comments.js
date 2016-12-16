import React from 'react'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import Message from 'tetris-iso/Message'
import {Button, Submit} from '../../Button'
import size from 'lodash/size'
import map from 'lodash/map'
import Switch from '../../Switch'
import {loadModuleCommentsAction} from '../../../actions/load-module-comments'
import {createModuleCommentAction} from '../../../actions/create-module-comment'
import {pushSuccessMessageAction} from '../../../actions/push-success-message-action'
import DatePicker from '../../DatePicker'

const Comment = ({body, user, creation}, {moment}) => (
  <li>
    <div>
      <strong>{user.name}</strong>
      <small style={{float: 'right'}}>
        {moment(creation).fromNow()}
      </small>

      <p dangerouslySetInnerHTML={{__html: body}}/>
    </div>
  </li>
)

Comment.displayName = 'Comment'
Comment.propTypes = {
  body: React.PropTypes.string.isRequired,
  user: React.PropTypes.shape({
    name: React.PropTypes.string
  }).isRequired,
  creation: React.PropTypes.string.isRequired
}
Comment.contextTypes = {
  moment: React.PropTypes.func.isRequired
}

const Comments = React.createClass({
  displayName: 'Comments',
  propTypes: {
    close: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    module: React.PropTypes.shape({
      id: React.PropTypes.string,
      comments: React.PropTypes.array
    }).isRequired
  },
  contextTypes: {
    moment: React.PropTypes.func.isRequired,
    tree: React.PropTypes.object.isRequired
  },
  componentWillMount () {
    this.setState({
      date: this.context.moment().format('YYYY-MM-DD')
    })
  },
  isGuest () {
    return this.context.tree.get(['user', 'is_guest'])
  },
  onSubmit (e) {
    e.preventDefault()

    this.submit(e.target)
  },
  /**
   *
   * @param {HTMLFormElement} form el
   * @return {Promise} promise that resolves according to create-comment action
   */
  submit (form) {
    if (this.isGuest()) return

    const comment = {
      body: form.elements.body.value,
      private: form.elements.isPrivate.checked,
      date: form.elements.__date__.dataset.value
    }

    this.props.save(comment).then(() => {
      form.elements.body.value = ''
    })
  },
  onChangeDate (momentDate) {
    this.setState({
      date: momentDate.format('YYYY-MM-DD')
    })
  },
  /**
   *
   * @param {KeyboardEvent} e keypress event
   * @return {undefined}
   */
  detectEnter (e) {
    if (e.which === 13 && e.ctrlKey) {
      this.submit(e.target.form)
    }
  },
  render () {
    const {close, module} = this.props
    const isGuestUser = this.isGuest()

    return (
      <form onSubmit={this.onSubmit}>
        <ul>{map(module.comments, comment =>
          <Comment key={comment.id} {...comment}/>)}
        </ul>

        {!isGuestUser && <div className='mdl-textfield'>
          <textarea
            onKeyDown={this.detectEnter}
            className='mdl-textfield__input'
            name='body'/>
        </div>}

        {!isGuestUser && <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--7-col'>
            <DatePicker onChange={this.onChangeDate} value={this.state.date}/>
          </div>
          <div className='mdl-cell mdl-cell--5-col'>
            <Switch name='isPrivate' label={<Message>isPrivateComment</Message>}/>
          </div>
        </div>}

        <hr/>

        <Button className='mdl-button mdl-button--accent' onClick={close}>
          <Message>cancel</Message>
        </Button>

        {!isGuestUser && <Submit className='mdl-button mdl-button--primary'>
          <Message>save</Message>
        </Submit>}
      </form>
    )
  }
})

const CommentsButton = React.createClass({
  displayName: 'Comments-Button',
  propTypes: {
    dispatch: Comments.propTypes.dispatch,
    params: Comments.propTypes.params,
    module: Comments.propTypes.module
  },
  contextTypes: {
    reportParams: React.PropTypes.object.isRequired
  },
  componentDidMount () {
    this.loadComments()
  },
  componentWillReceiveProps (nextProps, {reportParams}) {
    const {reportParams: {from, to}} = this.context

    if (from !== reportParams.from || to !== reportParams.to) {
      this.loadComments(reportParams)
    }
  },
  loadComments (reportParams = this.context.reportParams) {
    const {dispatch, params, module} = this.props

    return dispatch(loadModuleCommentsAction, params, reportParams, module.id)
  },
  createComment (comment) {
    const {dispatch, params, module} = this.props

    return dispatch(createModuleCommentAction, params, module.id, comment)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(this.loadComments)
  },
  render () {
    const {module, params, dispatch} = this.props
    const count = module.comments ? size(module.comments) : '.'
    const icon = <div className='material-icons mdl-badge mdl-badge--overlap' data-badge={count}>chat</div>

    return (
      <ButtonWithPrompt tag={Button} label={icon} className='mdl-button mdl-button--icon'>
        {({dismiss}) =>
          <Comments
            close={dismiss}
            params={params}
            dispatch={dispatch}
            module={module}
            save={this.createComment}/>}
      </ButtonWithPrompt>
    )
  }
})

CommentsButton.displayName = 'Comments-Button'

export default CommentsButton
