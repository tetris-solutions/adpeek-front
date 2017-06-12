import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import map from 'lodash/map'
import {style, withPreview, DestinationUrl, KPI, kpiType} from './AdUtils'
import {findImageAdUrl} from '../../functions/find-image-ad-url'

let Banner = ({url, previewMode, setPreviewMode}) => url
  ? (
    <div className={style.banner} style={{backgroundImage: `url(${url})`}} onClick={() => setPreviewMode(true)}>
      {previewMode && (
        <Modal onEscPress={() => setPreviewMode(false)}>
          <img className={style.preview} src={url}/>
        </Modal>)}
    </div>
  ) : null

Banner.displayName = 'Banner'
Banner.propTypes = {
  url: PropTypes.string,
  previewMode: PropTypes.bool,
  setPreviewMode: PropTypes.func
}

Banner = withPreview(Banner)

const ImageAd = ({kpi, urls, final_urls}) => (
  <div className={style.wrapper}>
    <div className={`mdl-color--yellow-200 ${style.box}`}>
      {kpi && <KPI kpi={kpi}/>}
      <Banner url={findImageAdUrl(urls)}/>
    </div>

    {map(final_urls, (url, index) =>
      <DestinationUrl key={index} url={url}/>)}
  </div>
)

ImageAd.displayName = 'Image-Ad'
ImageAd.propTypes = {
  kpi: kpiType,
  urls: PropTypes.array,
  final_urls: PropTypes.array
}

export default ImageAd
