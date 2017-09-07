import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import Modal from '@tetris/front-server/Modal'
import map from 'lodash/map'
import {style, KPI, kpiType} from './AdUtils'
import {liveEditAdAction, removeAdAction} from '../../actions/update-campaign-creatives'
import {checkBlacklistedWords} from '../../functions/check-blacklisted-words'
import CleanInput from './CleanInput'
import AdEdit from './AdEdit'
import assign from 'lodash/assign'
import join from 'lodash/join'
import compact from 'lodash/compact'
import some from 'lodash/some'
import debounce from 'lodash/debounce'
import DisplayUrl from './DisplayUrl'
import DescriptionLine from './DescriptionLine'
import {EditLink} from './EditableCreative'

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  DISABLED: 'remove'
}

class TextAd extends React.PureComponent {
  static displayName = 'Text-Ad'
  static propTypes = {
    params: PropTypes.object,
    dispatch: PropTypes.func,
    kpi: kpiType,
    id: PropTypes.string,
    draft: PropTypes.bool,
    headline: PropTypes.string,
    headline_part_1: PropTypes.string,
    headline_part_2: PropTypes.string,
    display_url: PropTypes.string,
    description: PropTypes.string,
    description_1: PropTypes.string,
    description_2: PropTypes.string,
    final_urls: PropTypes.array,
    path_1: PropTypes.string,
    path_2: PropTypes.string
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
      ad.headline,
      ad.headline_part_1,
      ad.headline_part_2,
      ad.description,
      ad.description_1,
      ad.description_2
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
          {ad.headline
            ? <h5>{ad.headline}</h5>
            : <h6>
              {editMode
                ? <CleanInput
                  block
                  name='headline_part_1'
                  maxLength={30}
                  placeholder={messages.adHeadline1Placeholder}
                  value={ad.headline_part_1}
                  onChange={this.onChange}/>
                : ad.headline_part_1}

              {!editMode && <br/>}

              {editMode
                ? <CleanInput
                  block
                  name='headline_part_2'
                  maxLength={30}
                  placeholder={messages.adHeadline2Placeholder}
                  value={ad.headline_part_2}
                  onChange={this.onChange}/>
                : ad.headline_part_2}</h6>}

          {ad.kpi && <KPI kpi={ad.kpi}/>}

          <DisplayUrl
            editMode={editMode && !deprecated}
            onChange={this.onChange}
            display_url={ad.display_url}
            final_urls={ad.final_urls}
            path_1={ad.path_1 || ''}
            path_2={ad.path_2 || ''}/>

          <DescriptionLine
            editMode={editMode}
            name='description'
            maxLength={80}
            multiline
            placeholder={messages.adDescriptionPlaceholder}
            value={ad.description}
            onChange={this.onChange}/>

          <DescriptionLine
            editMode={false}
            name='description_1'
            placeholder={messages.adDescription1Placeholder}
            value={ad.description_1}
            onChange={this.onChange}/>

          <DescriptionLine
            editMode={false}
            name='description_2'
            placeholder={messages.adDescription2Placeholder}
            value={ad.description_2}
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

        {map(ad.final_urls, (url, index) =>
          <div className={`mdl-color--yellow-200 ${style.box}`} key={index}>
            <strong>
              <Message>finalUrl</Message>
            </strong>
            <br/>
            <div className={style.finalUrl}>
              <a
                className={style.anchor}
                title={url}
                href={!deprecated && editMode ? undefined : url}
                target='_blank'>
                {!deprecated && editMode
                  ? (
                    <CleanInput
                      value={url}
                      style={{width: '100%'}}
                      placeholder='example.com'
                      onChange={this.onChange}
                      name='final_urls'/>
                  ) : url}
              </a>
            </div>
          </div>)}

        {isOpenModal('ad', ad.id) && (
          <Modal size='small' minHeight={0} onEscPress={() => closeModal('ad')}>
            <AdEdit
              close={() => closeModal('ad')}
              name={join(compact([ad.headline, ad.headline_part_1, ad.headline_part_2]), ' ')}
              status={ad.status}
              onChange={this.onChange}/>
          </Modal>)}
      </div>
    )
  }
}

export default TextAd
