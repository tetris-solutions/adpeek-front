import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import {styledComponent} from '../higher-order/styled'
import {liveEditKeywordAction, removeKeywordAction} from '../../actions/update-campaign-creatives'
import csjs from 'csjs'
import assign from 'lodash/assign'
import KeywordEdit from './KeywordEdit'
import CleanInput from './CleanInput'
import {inferKeywordMatchType} from '../../functions/keyword-utils'
import {EditLink} from './EditableCreative'

const style = csjs`
.keyword {
  position: relative;
  text-align: center;
  line-height: 1.6em;
  min-height: 1.6em;
  margin: .3em 0;
  padding: 0 20px
}
.keyword input {
  text-align: center;
  width: 100%;
}
.icon {
  cursor: pointer;
  position: absolute;
  top: 3px;
  left: 5px;
}
.icon i {
  font-size: 16px;
}`

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  REMOVED: 'remove'
}

const colorPerQualityScore = {
  UNKNOWN: {bg: 'grey-200', text: 'grey-900'},
  BELOW_AVERAGE: {bg: 'red-200', text: 'grey-900'},
  AVERAGE: {bg: 'blue-200', text: 'grey-900'},
  ABOVE_AVERAGE: {bg: 'light-green-200', text: 'grey-900'}
}

const color = qualityScore => colorPerQualityScore[qualityScore] || colorPerQualityScore.UNKNOWN

class Keyword extends React.PureComponent {
  static displayName = 'AdGroup-Keyword'

  static propTypes = {
    params: PropTypes.object,
    suggestedUrl: PropTypes.string,
    dispatch: PropTypes.func,
    draft: PropTypes.bool,
    id: PropTypes.string,
    relevance: PropTypes.oneOf(['UNKNOWN', 'BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE']),
    text: PropTypes.string,
    status: PropTypes.string,
    match_type: PropTypes.string
  }

  static contextTypes = {
    editMode: PropTypes.bool,
    isOpenModal: PropTypes.func,
    closeModal: PropTypes.func,
    messages: PropTypes.object
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id, draft} = this.props
    const changes = {[name]: value}

    if (name === 'status' && value === 'REMOVED' && draft) {
      dispatch(removeKeywordAction,
        assign({keyword: id}, params))
      return
    }

    if (name === 'text') {
      changes.match_type = inferKeywordMatchType(value)
    }

    if (name === 'final_urls') {
      changes.final_urls = [value]
    }

    dispatch(liveEditKeywordAction,
      assign({keyword: id}, params),
      changes)
  }

  render () {
    const {messages, editMode, isOpenModal, closeModal} = this.context
    const {suggestedUrl} = this.props
    const keyword = this.props
    const keywordClassName = `${style.keyword} mdl-color-text--${color(keyword.relevance).text} mdl-color--${color(keyword.relevance).bg}`

    return (
      <div className={keywordClassName}>
        {editMode && (
          <EditLink
            className={`${style.icon} mdl-color-text--grey-700`}
            title={keyword.status}
            name='keyword'
            value={keyword.id}>
            <i className='material-icons'>
              {statusIcon[keyword.status]}
            </i>
          </EditLink>)}

        {editMode ? (
          <CleanInput
            placeholder={messages.keywordPlaceholder}
            name='text'
            value={keyword.text}
            onChange={this.onChange}/>) : keyword.text}

        {isOpenModal('keyword', keyword.id) && (
          <Modal size='small' minHeight={0} onEscPress={() => closeModal('keyword')}>
            <KeywordEdit
              {...keyword}
              suggestedUrl={suggestedUrl}
              close={() => closeModal('keyword')}
              onChange={this.onChange}
              text={keyword.text || messages.newKeyword}/>
          </Modal>)}
      </div>
    )
  }
}

export default styledComponent(Keyword, style)
