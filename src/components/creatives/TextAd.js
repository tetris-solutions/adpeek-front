import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import map from 'lodash/map'
import {style, KPI, kpiType} from './AdUtils'
import {liveEditAdAction} from '../../actions/update-adgroups'
import {inferDisplayUrl, finalUrlsDomain} from '../../functions/infer-display-url'
import DiscreteInput from './DiscreteInput'
import AdEdit from './AdEdit'
import assign from 'lodash/assign'
import join from 'lodash/join'
import compact from 'lodash/compact'
import isString from 'lodash/isString'
import omit from 'lodash/omit'

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  DISABLED: 'remove'
}

function DescriptionLine (props) {
  if (!isString(props.value)) return null

  if (props.editMode) {
    return (
      <div>
        <DiscreteInput
          {...omit(props, 'editMode')}
          style={props.multiline ? undefined : {width: '100%'}}/>
      </div>
    )
  }

  return (
    <div>
      {props.value}
    </div>
  )
}

DescriptionLine.displayName = 'Description-Line'
DescriptionLine.defaultProps = {
  multiline: false
}
DescriptionLine.propTypes = {
  multiline: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
}

const DisplayUrlAnchor = ({clickable, url, children, style: css}) => (
  <a
    className={style.anchor}
    title={url}
    href={clickable ? `http://${url}` : undefined}
    target='_blank'
    style={css}>

    {children || url}
  </a>
)
DisplayUrlAnchor.displayName = 'Display-URL-Anchor'
DisplayUrlAnchor.propTypes = {
  style: PropTypes.object,
  clickable: PropTypes.bool,
  url: PropTypes.string,
  children: PropTypes.node
}

export function DisplayUrl ({display_url, final_urls, path_1, path_2, editMode, onChange}, {messages}) {
  if (isString(display_url)) {
    return (
      <DisplayUrlAnchor url={display_url} clickable={!editMode}>
        {editMode && (
          <DiscreteInput
            style={{width: '100%'}}
            name='display_url'
            value={display_url}
            onChange={onChange}
            placeholder={messages.displayUrlPlaceholder}/>)}
      </DisplayUrlAnchor>
    )
  }

  display_url = inferDisplayUrl(final_urls, path_1, path_2)

  return (
    <DisplayUrlAnchor url={display_url} clickable={!editMode} style={editMode ? {fontSize: 'x-small'} : undefined}>
      {editMode
        ? finalUrlsDomain(final_urls)
        : display_url}

      {editMode && ' / '}

      {editMode && (
        <DiscreteInput
          name='path_1'
          style={{width: 60}}
          maxLength={15}
          value={path_1}
          onChange={path_1}/>)}

      {editMode && ' / '}

      {editMode && (
        <DiscreteInput
          name='path_2'
          style={{width: 60}}
          maxLength={15}
          value={path_2}
          onChange={path_2}/>)}
    </DisplayUrlAnchor>
  )
}

DisplayUrl.displayName = 'Display-URL'
DisplayUrl.propTypes = {
  display_url: PropTypes.string.isRequired,
  final_urls: PropTypes.array.isRequired,
  path_1: PropTypes.string.isRequired,
  path_2: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}
DisplayUrl.contextTypes = {
  messages: PropTypes.object
}

class TextAd extends React.PureComponent {
  static displayName = 'Text-Ad'
  static propTypes = {
    editMode: PropTypes.bool,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    kpi: kpiType,
    id: PropTypes.string,
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
    messages: PropTypes.object
  }

  state = {
    modalOpen: false
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id} = this.props
    const update = {}

    if (name === 'final_urls') {
      update.final_urls = [value]
    } else {
      update[name] = value
    }

    dispatch(liveEditAdAction,
      assign({ad: id}, params),
      update)
  }

  toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  render () {
    const {messages} = this.context
    const {editMode} = this.props
    const ad = this.props

    return (
      <div className={style.wrapper}>
        <div className={`mdl-color--yellow-200 ${style.box}`}>
          {ad.headline
            ? <h5>{editMode
              ? <DiscreteInput name='headline' value={ad.headline} onChange={this.onChange}/>
              : ad.headline}</h5>

            : <h6>
              {editMode
                ? <DiscreteInput
                  name='headline_part_1'
                  maxLength={30}
                  placeholder={messages.adHeadline1Placeholder}
                  value={ad.headline_part_1}
                  onChange={this.onChange}/>
                : ad.headline_part_1}

              <br/>

              {editMode
                ? <DiscreteInput
                  name='headline_part_2'
                  maxLength={30}
                  placeholder={messages.adHeadline2Placeholder}
                  value={ad.headline_part_2}
                  onChange={this.onChange}/>
                : ad.headline_part_2}</h6>}

          {ad.kpi && <KPI kpi={ad.kpi}/>}

          <DisplayUrl
            editMode={editMode}
            onChange={this.onChange}
            display_url={ad.display_url}
            final_urls={ad.final_urls}
            path_1={ad.path_1}
            path_2={ad.path_2}/>

          <DescriptionLine
            editMode={editMode}
            name='description'
            maxLength={80}
            multiline
            placeholder={messages.adDescriptionPlaceholder}
            value={ad.description}
            onChange={this.onChange}/>

          <DescriptionLine
            editMode={editMode}
            name='description_1'
            placeholder={messages.adDescription1Placeholder}
            value={ad.description_1}
            onChange={this.onChange}/>

          <DescriptionLine
            editMode={editMode}
            name='description_2'
            placeholder={messages.adDescription2Placeholder}
            value={ad.description_2}
            onChange={this.onChange}/>

          {editMode && (
            <a className={`${style.editLink} mdl-color-text--grey-700`} title={ad.status} onClick={this.toggleModal}>
              <i className='material-icons'>{statusIcon[ad.status]}</i>
            </a>)}
        </div>

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
                href={editMode ? undefined : url}
                target='_blank'>
                {editMode
                  ? (
                    <DiscreteInput
                      value={url}
                      style={{width: '100%'}}
                      placeholder='example.com'
                      onChange={this.onChange}
                      name='final_urls'/>
                  ) : url}
              </a>
            </div>
          </div>)}

        {this.state.modalOpen && (
          <Modal size='small' minHeight={0} onEscPress={this.toggleModal}>
            <AdEdit
              close={this.toggleModal}
              name={join(compact([ad.headline, ad.headline_part_1, ad.headline_part_2]), ' ')}
              status={ad.status}
              onChange={this.onChange}/>
          </Modal>)}
      </div>
    )
  }
}

export default TextAd
