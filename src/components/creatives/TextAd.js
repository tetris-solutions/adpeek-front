import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import {style, DisplayUrl, KPI, kpiType} from './AdUtils'
import {liveEditAdAction} from '../../actions/update-adgroups'
import DiscreteInput from './DiscreteInput'
import assign from 'lodash/assign'

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

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id} = this.props

    dispatch(liveEditAdAction,
      assign({ad: id}, params),
      {[name]: value})
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
            : <h6>{ad.headline_part_1}<br/>{ad.headline_part_2}</h6>}

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
      </div>
    )
  }
}

export default TextAd
