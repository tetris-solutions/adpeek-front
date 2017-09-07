import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import Modal from '@tetris/front-server/Modal'
import {style, KPI, kpiType} from './AdUtils'
import {liveEditAdAction, removeAdAction} from '../../actions/update-campaign-creatives'
import {checkBlacklistedWords} from '../../functions/check-blacklisted-words'
import AdEdit from './AdEdit'
import assign from 'lodash/assign'
import join from 'lodash/join'
import compact from 'lodash/compact'
import some from 'lodash/some'
import debounce from 'lodash/debounce'
import DescriptionLine from './DescriptionLine'
import CleanInput from './CleanInput'
import DisplayUrl from './DisplayUrl'
import {EditLink} from './EditableCreative'

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  DISABLED: 'remove'
}

class CallOnlyAd extends React.PureComponent {
  static displayName = 'Call-Only-Ad'
  static propTypes = {
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
    editMode: PropTypes.bool,
    isOpenModal: PropTypes.func,
    closeModal: PropTypes.func,
    messages: PropTypes.object
  }

  state = {
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

  render () {
    const {messages, editMode, closeModal, isOpenModal} = this.context
    const ad = this.props
    const deprecated = ad.type === 'TEXT_AD'
    const badWords = editMode && !deprecated &&
      this.state.badWords

    return (
      <div className={style.wrapper}>
        <div className={`mdl-color--yellow-200 ${style.box}`}>
          <h5>
            {editMode
              ? <CleanInput
                block
                name='business_name'
                maxLength={30}
                placeholder={messages.businessNamePlaceholder}
                value={ad.business_name}
                onChange={this.onChange}/>
              : ad.business_name}
          </h5>

          {ad.kpi && <KPI kpi={ad.kpi}/>}

          <DisplayUrl
            editMode={editMode}
            onChange={this.onChange}
            display_url={ad.display_url}/>

          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--3-col'>
              <CleanInput
                maxLength={2}
                name='country_code'
                placeholder='BR'
                value={ad.country_code}
                onChange={this.onChange}/>
            </div>
            <div className='mdl-cell mdl-cell--9-col'>
              <CleanInput
                name='phone_number'
                placeholder='(00) 0000-0000'
                value={ad.phone_number}
                onChange={this.onChange}/>
            </div>
          </div>

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
            <EditLink
              name='ad'
              value={ad.id}
              className={`${style.editLink} mdl-color-text--grey-700`}
              title={ad.status}>
              <i className='material-icons'>{statusIcon[ad.status]}</i>
            </EditLink>)}
        </div>

        {badWords && (
          <p className={`${style.alert} mdl-color-text--red-700`}>
            <Message html>adContainsBadWords</Message>
          </p>)}

        {isOpenModal('ad', ad.id) && (
          <Modal size='small' minHeight={0} onEscPress={() => closeModal('ad')}>
            <AdEdit
              close={() => closeModal('ad')}
              name={join(compact([ad.call_ad_description_1, ad.call_ad_description_2]), ' ')}
              status={ad.status}
              onChange={this.onChange}/>
          </Modal>)}
      </div>
    )
  }
}

export default CallOnlyAd
