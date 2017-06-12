import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import map from 'lodash/map'
import {style, DisplayUrl, KPI, kpiType} from './AdUtils'
import {liveEditAdAction} from '../../actions/update-adgroups'
import DiscreteInput from './DiscreteInput'
import AdEdit from './AdEdit'
import assign from 'lodash/assign'
import join from 'lodash/join'
import compact from 'lodash/compact'

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  DISABLED: 'remove'
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

  state = {
    modalOpen: false
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id} = this.props

    dispatch(liveEditAdAction,
      assign({ad: id}, params),
      {[name]: value})
  }

  toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  render () {
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
                ? <DiscreteInput name='headline_part_1' value={ad.headline_part_1} onChange={this.onChange}/>
                : ad.headline_part_1}
              <br/>
              {editMode
                ? <DiscreteInput name='headline_part_2' value={ad.headline_part_2} onChange={this.onChange}/>
                : ad.headline_part_2}</h6>}

          {ad.kpi && <KPI kpi={ad.kpi}/>}

          <DisplayUrl
            display_url={ad.display_url}
            final_urls={ad.final_urls}
            path_1={ad.path_1}
            path_2={ad.path_2}/>

          <div>{ad.description || ad.description_1}</div>

          {ad.description_2
            ? <div>{ad.description_2}</div>
            : null}

          {editMode &&
            <a className={style.editLink} onClick={this.toggleModal}>
              <i className='material-icons'>{statusIcon[ad.status]}</i>
            </a>}
        </div>

        {map(ad.final_urls, (url, index) =>
          <div className={`mdl-color--yellow-200 ${style.box}`} key={index}>
            <strong>
              <Message>finalUrl</Message>
            </strong>
            <br/>
            <div className={style.finalUrl}>
              <a className={style.anchor} href={url} title={url} target='_blank'>
                {url}
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
