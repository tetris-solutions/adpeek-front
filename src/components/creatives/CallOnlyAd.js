import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import {style, KPI, kpiType} from './AdUtils'
import {liveEditAdAction, removeAdAction} from '../../actions/update-adgroups'
import {checkBlacklistedWords} from '../../functions/check-blacklisted-words'
import AdEdit from './AdEdit'
import assign from 'lodash/assign'
import join from 'lodash/join'
import compact from 'lodash/compact'
import some from 'lodash/some'
import debounce from 'lodash/debounce'
import DescriptionLine from './DescriptionLine'

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  DISABLED: 'remove'
}

class CallOnlyAd extends React.PureComponent {
  static displayName = 'Call-Only-Ad'
  static propTypes = {
    editMode: PropTypes.bool,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    kpi: kpiType,
    id: PropTypes.string,
    draft: PropTypes.bool,
    business_name: PropTypes.string,
    country_code: PropTypes.string,
    call_ad_description_1: PropTypes.string,
    call_ad_description_2: PropTypes.string,
    phone_number: PropTypes.string
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    modalOpen: false,
    badWords: false
  }

  componentWilReceiveProps (nextProps) {
    if (this.shouldCheckAgain) {
      this.checkBadWords(nextProps)
    }
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id, draft} = this.props
    const update = {}

    if (name === 'status' && value === 'DISABLED' && draft) {
      dispatch(removeAdAction,
        assign({ad: id}, params))
      return
    }

    if (name === 'final_urls') {
      update.final_urls = [value]
    } else {
      update[name] = value
    }

    dispatch(liveEditAdAction,
      assign({ad: id}, params),
      update)

    this.shouldCheckAgain = true
  }

  checkBadWords = debounce(ad => {
    this.shouldCheckAgain = false

    const badWords = some([
      ad.call_ad_description_1,
      ad.call_ad_description_2
    ], checkBlacklistedWords)

    this.setState({badWords})
  }, 1000)

  toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  render () {
    const {messages} = this.context
    const {editMode} = this.props
    const ad = this.props
    const deprecated = ad.type === 'TEXT_AD'
    const badWords = editMode && !deprecated &&
      this.state.badWords

    return (
      <div className={style.wrapper}>
        <div className={`mdl-color--yellow-200 ${style.box}`}>

          {ad.kpi && <KPI kpi={ad.kpi}/>}

          <DescriptionLine
            editMode={editMode}
            name='call_ad_description_1'
            placeholder={messages.adDescription1Placeholder}
            value={ad.call_ad_description_1}
            onChange={this.onChange}/>

          <DescriptionLine
            editMode={editMode}
            name='call_ad_description_2'
            placeholder={messages.adDescription2Placeholder}
            value={ad.call_ad_description_2}
            onChange={this.onChange}/>

          {editMode && (
            <a className={`${style.editLink} mdl-color-text--grey-700`} title={ad.status} onClick={this.toggleModal}>
              <i className='material-icons'>{statusIcon[ad.status]}</i>
            </a>)}
        </div>

        {badWords && (
          <p className={`${style.alert} mdl-color-text--red-700`}>
            <Message html>adContainsBadWords</Message>
          </p>)}

        {this.state.modalOpen && (
          <Modal size='small' minHeight={0} onEscPress={this.toggleModal}>
            <AdEdit
              close={this.toggleModal}
              name={join(compact([ad.call_ad_description_1, ad.call_ad_description_2]), ' ')}
              status={ad.status}
              onChange={this.onChange}/>
          </Modal>)}
      </div>
    )
  }
}

export default CallOnlyAd
