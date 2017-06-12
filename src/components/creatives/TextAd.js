import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import {style, DisplayUrl, KPI, kpiType} from './AdUtils'

const TextAd = ({kpi, headline, headline_part_1, headline_part_2, display_url, description, description_1, description_2, path_1, path_2, final_urls}) => (
  <div className={style.wrapper}>
    <div className={`mdl-color--yellow-200 ${style.box}`}>
      {headline
        ? <h5>{headline}</h5>
        : <h6>{headline_part_1}<br/>{headline_part_2}</h6>}

      {kpi && <KPI kpi={kpi}/>}

      <DisplayUrl
        display_url={display_url}
        final_urls={final_urls}
        path_1={path_1}
        path_2={path_2}/>

      <div>{description || description_1}</div>

      {description_2
        ? <div>{description_2}</div>
        : null}
    </div>

    {map(final_urls, (url, index) =>
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

TextAd.displayName = 'Text-Ad'
TextAd.propTypes = {
  kpi: kpiType,
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

export default TextAd
