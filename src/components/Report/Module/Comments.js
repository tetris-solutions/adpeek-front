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

const NewComment = React.createClass({
  displayName: 'New-Comment',
  propTypes: {
    children: React.PropTypes.node,
    save: React.PropTypes.func.isRequired
  },
  contextTypes: {
    moment: React.PropTypes.func.isRequired
  },
  componentWillMount () {
    this.setState({
      date: this.context.moment().format('YYYY-MM-DD')
    })
  },
  onSubmit (e) {
    const {save} = this.props

    e.preventDefault()
    /**
     * @type {HTMLFormElement}
     */
    const form = e.target
    const comment = {
      body: form.elements.body.value,
      private: form.elements.isPrivate.checked,
      date: form.elements.__date__.dataset.value
    }

    save(comment).then(() => {
      form.elements.body.value = ''
    })
  },
  onChangeDate (momentDate) {
    this.setState({
      date: momentDate.format('YYYY-MM-DD')
    })
  },
  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <div className='mdl-textfield'>
          <textarea className='mdl-textfield__input' name='body'/>
        </div>

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--7-col'>
            <DatePicker onChange={this.onChangeDate} value={this.state.date}/>
          </div>
          <div className='mdl-cell mdl-cell--5-col'>
            <Switch name='isPrivate' label='isPrivate'/>
          </div>
        </div>

        <hr/>

        {this.props.children}
        <Submit className='mdl-button mdl-button--primary'>
          <Message>save</Message>
        </Submit>
      </form>
    )
  }
})

const Comments = ({close, save, module, params, dispatch}) => (
  <div>
    <ul>{map(module.comments, comment =>
      <Comment key={comment.id} {...comment}/>)}
    </ul>
    <NewComment save={save}>
      <Button className='mdl-button mdl-button--accent' onClick={close}>
        <Message>cancel</Message>
      </Button>
    </NewComment>
  </div>
)

Comments.displayName = 'Comments'
Comments.propTypes = {
  close: React.PropTypes.func.isRequired,
  save: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  module: React.PropTypes.shape({
    id: React.PropTypes.string,
    comments: React.PropTypes.array
  }).isRequired
}

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
  loadComments () {
    const {dispatch, params, module} = this.props
    const {reportParams} = this.context

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
