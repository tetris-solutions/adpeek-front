import React from 'react'
import Switch from '../../Switch'
import DatePicker from '../../DatePicker'
import VerticalAlign from '../../VerticalAlign'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import Message from 'tetris-iso/Message'
import {Button, Submit} from '../../Button'
import {styled} from '../../mixins/styled'
import csjs from 'csjs'
import size from 'lodash/size'
import map from 'lodash/map'
import {loadModuleCommentsAction} from '../../../actions/load-module-comments'
import {createModuleCommentAction} from '../../../actions/create-module-comment'
import {pushSuccessMessageAction} from '../../../actions/push-success-message-action'
import {deleteModuleAction} from '../../../actions/delete-module-comment'
import Fence from '../../Fence'
import bind from 'lodash/bind'

const style = csjs`
.comment {
  position: relative;
  border-top: 1px solid #efefef;
}
.comment:first-of-type {
  border-top: none;
}
.time {
  position: absolute;
  right: 1em;
  top: .8em;
  color: rgba(0,0,0,.54);
  font-size: x-small;
}
.text {
  width: 100%;
}`

const Middle = ({className, children}) => (
  <VerticalAlign className={className}>
    <div>{children}</div>
  </VerticalAlign>
)

Middle.displayName = 'Middle'
Middle.propTypes = {
  className: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired
}

const Comment = ({id, date, body, user, creation, del}, {moment}) => (
  <li className={`mdl-list__item mdl-list__item--two-line ${style.comment}`}>
    <span className='mdl-list__item-primary-content'>
      <span>{user.name}</span>
      <div className='mdl-list__item-sub-title' dangerouslySetInnerHTML={{
        __html: `<strong>${moment(date).format('D/MMM')}:</strong> ${body}`
      }}/>
    </span>

    <Fence isRegularUser>
      <span className='mdl-list__item-secondary-content'>
        <i className='material-icons' onClick={del}>close</i>
      </span>
    </Fence>

    <small className={`${style.time}`}>
      {moment(creation).fromNow()}
    </small>
  </li>
)

Comment.displayName = 'Comment'
Comment.propTypes = {
  id: React.PropTypes.string.isRequired,
  del: React.PropTypes.func.isRequired,
  date: React.PropTypes.string.isRequired,
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
    del: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    module: React.PropTypes.shape({
      id: React.PropTypes.string,
      comments: React.PropTypes.array
    }).isRequired
  },
  contextTypes: {
    messages: React.PropTypes.object.isRequired,
    moment: React.PropTypes.func.isRequired
  },
  componentWillMount () {
    this.setState({
      date: this.context.moment().format('YYYY-MM-DD')
    })
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
    const {messages} = this.context
    const {close, del, module} = this.props

    return (
      <form onSubmit={this.onSubmit}>
        <Fence isRegularUser>
          <div>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <div className={`mdl-textfield ${style.text}`}>
                  <textarea
                    placeholder={messages.newCommentPlaceholder}
                    required
                    onKeyDown={this.detectEnter}
                    className='mdl-textfield__input'
                    name='body'/>
                </div>
              </div>
              <div className='mdl-cell mdl-cell--6-col'>
                <DatePicker onChange={this.onChangeDate} value={this.state.date}/>
              </div>
              <Middle className='mdl-cell mdl-cell--3-col'>
                <Switch name='isPrivate' label={<Message>isPrivateComment</Message>}/>
              </Middle>
              <Middle className='mdl-cell mdl-cell--3-col'>
                <Submit className='mdl-button mdl-button--primary'>
                  <Message>newCommentButton</Message>
                </Submit>
              </Middle>
            </div>

            <hr/>
          </div>
        </Fence>

        <ul className='mdl-list'>
          {map(module.comments, comment =>
            <Comment key={comment.id} {...comment} del={bind(del, null, comment.id)}/>)}
        </ul>

        <hr/>

        <div style={{textAlign: 'right'}}>
          <Button className='mdl-button mdl-button--accent' onClick={close}>
            <Message>close</Message>
          </Button>
        </div>
      </form>
    )
  }
})

const CommentsButton = React.createClass({
  displayName: 'Comments-Button',
  mixins: [styled(style)],
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
  deleteComment (commentId) {
    const {dispatch, params, module} = this.props

    return dispatch(deleteModuleAction, params, module.id, commentId)
      .then(() => dispatch(pushSuccessMessageAction))
  },
  render () {
    const {module, params, dispatch} = this.props
    const count = module.comments ? size(module.comments) : '.'
    const icon = <div className='material-icons mdl-badge mdl-badge--overlap' data-badge={count}>chat_bubble</div>

    return (
      <ButtonWithPrompt tag={Button} size='medium' label={icon} className='mdl-button mdl-button--icon'>
        {({dismiss}) =>
          <Comments
            close={dismiss}
            params={params}
            dispatch={dispatch}
            module={module}
            del={this.deleteComment}
            save={this.createComment}/>}
      </ButtonWithPrompt>
    )
  }
})

CommentsButton.displayName = 'Comments-Button'

export default CommentsButton
