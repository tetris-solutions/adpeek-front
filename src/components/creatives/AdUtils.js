import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {withState} from 'recompose'
import {inferDisplayUrl} from '../../functions/infer-display-url'

export const withPreview = withState('previewMode', 'setPreviewMode', false)

export const style = csjs`
.wrapper {
  padding-bottom: 1em;
  border-bottom: 1px solid grey;
}
.wrapper:last-child {
  border-bottom: none;
}
.finalUrl {
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap
}
.box {
  display: block;
  position: relative;
  margin-top: 1em;
  padding: .7em;
  text-overflow: ellipsis;
}
.anchor {
  white-space: nowrap;
  height: 2em;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  line-height: 2em;
}
.box > h6 {
  margin: 0 0 .5em;
  font-weight: 500;
}
.box > h5 {
  margin: .7em 0 .5em;
}
.kpi {
  position: absolute;
  font-weight: bold;
  font-size: small;
  top: -0.3em;
  right: -0.3em;
  line-height: 1.5em;
  border-radius: 4px;
  padding: 0 .5em;
}
.banner {
  cursor: pointer;
  width: 100%;
  height: 200px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.preview {
  display: block;
  margin: 100px auto;
}
.templatePreview {
  display: relative;
}
.templatePreviewOverlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
}
.templatePreviewModal {
  text-align: center;
}
.templatePreviewIframe {
  display: inline-block;
  width: 300px;
  margin: 100px;
}
.link {
  word-break: break-all;
}
.youtubeThumb {
  cursor: pointer;
}
.youtubeThumb > img{
  width: 100%;
  height: auto;
}
.editLink {
  display: block;
  text-align: right;
  margin-top: 1em;
  font-size: smaller;
}
.editLink > i {
  cursor: pointer;
}`

export const DestinationUrl = ({url}) => (
  <div className={`mdl-color--yellow-200 ${style.box}`}>
    <strong>
      <Message>finalUrl</Message>
    </strong>
    <br/>
    <div className={style.finalUrl}>
      <a className={style.anchor} href={url} title={url} target='_blank'>
        {url}
      </a>
    </div>
  </div>
)

DestinationUrl.displayName = 'Destination-URL'
DestinationUrl.propTypes = {
  url: PropTypes.string
}

export function DisplayUrl ({display_url, final_urls, path_1, path_2}) {
  display_url = display_url || inferDisplayUrl(final_urls, path_1, path_2)

  return (
    <a className={style.anchor} title={display_url} href={`http://${display_url}`} target='_blank'>
      {display_url}
    </a>
  )
}

DisplayUrl.displayName = 'Display-URL'
DisplayUrl.propTypes = {
  display_url: PropTypes.string,
  final_urls: PropTypes.array,
  path_1: PropTypes.string,
  path_2: PropTypes.string
}

const colors = {
  good: 'light-green-900',
  bad: 'red-900',
  neutral: 'grey-800'
}

export const kpiType = PropTypes.shape({
  name: PropTypes.string,
  status: PropTypes.string,
  text: PropTypes.string
})

export const KPI = ({kpi}) => (
  <span title={kpi.name} className={`mdl-color--${colors[kpi.status]} mdl-color-text--white ${style.kpi}`}>
    {kpi.text}
  </span>
)

KPI.displayName = 'KPI'
KPI.propTypes = {
  kpi: kpiType
}
