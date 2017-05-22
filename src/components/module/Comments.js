import React from 'react'
import PropTypes from 'prop-types'
import TextMessage from 'intl-messageformat'
import Switch from '../Switch'
import DatePicker from '../DatePicker'
import VerticalAlign from '../VerticalAlign'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import Message from 'tetris-iso/Message'
import {Button, Submit} from '../Button'
import {styledComponent} from '../higher-order/styled'
import csjs from 'csjs'
import size from 'lodash/size'
import map from 'lodash/map'
import DeleteButton from '../DeleteButton'
import {loadModuleCommentsAction} from '../../actions/load-module-comments'
import {createModuleCommentAction} from '../../actions/create-module-comment'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {deleteModuleAction} from '../../actions/delete-module-comment'
import Fence from '../Fence'
import bind from 'lodash/bind'

const style = csjs`
.button {
  overflow: visible;
}
.comment {
  position: relative;
  border-bottom: 1px solid #efefef;
  padding: 1em;
}
.comment:last-child {
  border-bottom: none;
}
.name {
  font-size: 13pt;
}
.body {
  font-size: small;
  margin: .3em 0;
}
.del {
  position: absolute;
  top: 5px;
  right: 5px;
}
.del > i {
  font-size: medium;
}
.time {
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
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

const Comment = ({id, date, body, user, creation, del}, {messages, moment, locales}) => (
  <div className={style.comment}>
    <Fence isRegularUser>
      <DeleteButton
        tag={Button}
        className={`mdl-button mdl-button--icon ${style.del}`}
        onClick={del}
        entityName={new TextMessage(messages.commentDescription, locales).format({user: user.name})}>
        <i className='material-icons'>close</i>
      </DeleteButton>
    </Fence>

    <strong className={`${style.name} mdl-color-text--grey-900`}>
      {user.name}
    </strong>

    <p className={`${style.body} mdl-color-text--grey-800`} dangerouslySetInnerHTML={{
      __html: `<strong>${moment(date).format('D/MMM')}:</strong> ${body.replace(/\n/g, '<br>')}`
    }}/>

    <small className={style.time}>
      {moment(creation).fromNow()}
    </small>
  </div>
)

Comment.displayName = 'Comment'
Comment.propTypes = {
  id: PropTypes.string.isRequired,
  del: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  creation: PropTypes.string.isRequired
}
Comment.contextTypes = {
  locales: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  moment: PropTypes.func.isRequired
}

class Comments extends React.Component {
  static displayName = 'Comments'

  static propTypes = {
    close: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    module: PropTypes.shape({
      id: PropTypes.string,
      comments: PropTypes.array
    }).isRequired
  }

  static contextTypes = {
    messages: PropTypes.object.isRequired,
    moment: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.setState({
      date: this.context.moment().format('YYYY-MM-DD')
    })
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.submit(e.target)
  }

  /**
   *
   * @param {HTMLFormElement} form el
   * @return {Promise} promise that resolves according to create-comment action
   */
  submit = (form) => {
    const comment = {
      body: form.elements.body.value,
      private: form.elements.isPrivate.checked,
      date: form.elements.__date__.dataset.value
    }

    this.props.save(comment).then(() => {
      form.elements.body.value = ''
    })
  }

  onChangeDate = (momentDate) => {
    this.setState({
      date: momentDate.format('YYYY-MM-DD')
    })
  }

  /**
   *
   * @param {KeyboardEvent} e keypress event
   * @return {undefined}
   */
  detectEnter = (e) => {
    if (e.which === 13 && e.ctrlKey) {
      this.submit(e.target.form)
    }
  }

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

        <section>
          {map(module.comments, comment =>
            <Comment
              key={comment.id}
              {...comment}
              del={bind(del, null, comment.id)}/>)}
        </section>
        <hr/>

        <div style={{textAlign: 'right'}}>
          <Button className='mdl-button mdl-button--accent' onClick={close}>
            <Message>close</Message>
          </Button>
        </div>
      </form>
    )
  }
}

class CommentsButton extends React.Component {
  static displayName = 'Comments-Button'

  static propTypes = {
    dispatch: Comments.propTypes.dispatch,
    params: Comments.propTypes.params,
    module: Comments.propTypes.module
  }

  static contextTypes = {
    reportParams: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.loadComments()
  }

  componentWillReceiveProps (nextProps, {reportParams}) {
    const {reportParams: {from, to}} = this.context

    if (from !== reportParams.from || to !== reportParams.to) {
      this.loadComments(reportParams)
    }
  }

  loadComments = (reportParams = this.context.reportParams) => {
    const {dispatch, params, module} = this.props

    return dispatch(loadModuleCommentsAction, params, reportParams, module.id)
  }

  createComment = (comment) => {
    const {dispatch, params, module} = this.props

    return dispatch(createModuleCommentAction, params, module.id, comment)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(this.loadComments)
  }

  deleteComment = (commentId) => {
    const {dispatch, params, module} = this.props

    return dispatch(deleteModuleAction, params, module.id, commentId)
      .then(() => dispatch(pushSuccessMessageAction))
  }

  render () {
    const {module, params, dispatch} = this.props
    const count = module.comments ? size(module.comments) : null

    const icoProps = count
      ? {className: 'material-icons mdl-badge mdl-badge--overlap', 'data-badge': count}
      : {className: 'material-icons'}

    return (
      <ButtonWithPrompt
        tag={Button}
        size='medium'
        label={<div {...icoProps}>chat_bubble</div>}
        className={`mdl-button mdl-button--icon ${style.button}`}>

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
}

export default styledComponent(CommentsButton, style)
