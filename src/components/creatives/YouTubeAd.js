import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import {style, withPreview} from './AdUtils'
import floor from 'lodash/floor'

let YouTubeAd = ({title, video_id, previewMode, setPreviewMode}) => (
  <div className={style.wrapper}>
    <div
      className={`mdl-color--yellow-200 ${style.box} ${style.youtubeThumb}`}
      onClick={() => setPreviewMode(!previewMode)}>

      <img src={`http://img.youtube.com/vi/${video_id}/mqdefault.jpg`}/>
      <h6>{title}</h6>
      {previewMode && (
        <Modal onEscPress={() => setPreviewMode(false)}>
          <iframe
            width={750}
            height={floor(750 * (9 / 16))}
            frameBorder={0}
            src={`https://www.youtube.com/embed/${video_id}`}
            allowFullScreen/>
        </Modal>)}
    </div>
  </div>
)
YouTubeAd.displayName = 'YouTube-Ad'
YouTubeAd.propTypes = {
  video_id: PropTypes.string,
  title: PropTypes.string,
  previewMode: PropTypes.bool,
  setPreviewMode: PropTypes.func
}

YouTubeAd = withPreview(YouTubeAd)

export default YouTubeAd
