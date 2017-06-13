import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import {styledComponent} from '../higher-order/styled'
import {liveEditKeywordAction} from '../../actions/update-adgroups'
import csjs from 'csjs'
import assign from 'lodash/assign'
import KeywordEdit from './KeywordEdit'

const style = csjs`
.keyword {
  position: relative;
  text-align: center;
  line-height: 1.6em;
  margin: .3em 0;
  padding: 0 20px
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
    dispatch: PropTypes.func,
    editMode: PropTypes.bool,
    id: PropTypes.string,
    relevance: PropTypes.oneOf(['UNKNOWN', 'BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE']),
    text: PropTypes.string,
    status: PropTypes.string,
    match_type: PropTypes.string
  }

  state = {
    modalOpen: false
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id} = this.props

    dispatch(liveEditKeywordAction,
      assign({keyword: id}, params),
      {[name]: value})
  }

  toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  render () {
    const {editMode, text, match_type, status, relevance} = this.props
    const content = match_type === 'EXACT' ? `[${text}]` : text

    return (
      <div className={`${style.keyword} mdl-color-text--${color(relevance).text} mdl-color--${color(relevance).bg}`}>
        {editMode && status && (
          <a className={`${style.icon} mdl-color-text--grey-700`} title={status} onClick={this.toggleModal}>
            <i className='material-icons'>
              {statusIcon[status]}
            </i>
          </a>)}

        {content}

        {this.state.modalOpen && (
          <Modal size='small' minHeight={0} onEscPress={this.toggleModal}>
            <KeywordEdit
              close={this.toggleModal}
              name={content}
              status={status}
              onChange={this.onChange}/>
          </Modal>)}
      </div>
    )
  }
}

export default styledComponent(Keyword, style)
