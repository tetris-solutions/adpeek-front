import React from 'react'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import Modal from 'tetris-iso/Modal'
import {styledFnComponent} from './higher-order/styled-fn-component'
import {withState} from 'recompose'
import {inferDisplayUrl} from '../functions/infer-display-url'
import {findImageAdUrl} from '../functions/find-image-ad-url'
import {findTemplateAdUrl} from '../functions/find-template-ad-url'

const style = csjs`
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
}`

const colors = {
  good: 'light-green-900',
  bad: 'red-900',
  neutral: 'grey-800'
}

const DestinationUrl = ({url}) => (
  <div className={`mdl-color--yellow-200 ${style.box}`}>
    <strong>
      <Message>finalUrl</Message>
    </strong>
    <br/>
    <div className={`${style.finalUrl}`}>
      <a className={`${style.anchor}`} href={url} title={url} target='_blank'>
        {url}
      </a>
    </div>
  </div>
)

DestinationUrl.displayName = 'Destination-URL'
DestinationUrl.propTypes = {
  url: React.PropTypes.string
}

function DisplayUrl ({display_url, final_urls, path_1, path_2}) {
  display_url = display_url || inferDisplayUrl(final_urls, path_1, path_2)

  return (
    <a className={`${style.anchor}`} title={display_url} href={`http://${display_url}`} target='_blank'>
      {display_url}
    </a>
  )
}

DisplayUrl.displayName = 'Display-URL'
DisplayUrl.propTypes = {
  display_url: React.PropTypes.string,
  final_urls: React.PropTypes.array,
  path_1: React.PropTypes.string,
  path_2: React.PropTypes.string
}

let Banner = ({url, previewMode, setPreviewMode}) => url
  ? (
    <div className={`${style.banner}`} style={{backgroundImage: `url(${url})`}} onClick={() => setPreviewMode(true)}>
      {previewMode && (
        <Modal onEscPress={() => setPreviewMode(false)}>
          <img className={`${style.preview}`} src={url}/>
        </Modal>)}
    </div>
  ) : null

Banner.displayName = 'Banner'
Banner.propTypes = {
  url: React.PropTypes.string,
  previewMode: React.PropTypes.bool,
  setPreviewMode: React.PropTypes.func
}

Banner = withState('previewMode', 'setPreviewMode', false)(Banner)

const ImageAd = ({urls, final_urls}) => (
  <div className={`${style.wrapper}`}>
    <div className={`mdl-color--yellow-200 ${style.box}`}>
      <Banner url={findImageAdUrl(urls)}/>
    </div>

    {map(final_urls, (url, index) =>
      <DestinationUrl key={index} url={url}/>)}
  </div>
)

ImageAd.displayName = 'Image-Ad'
ImageAd.propTypes = {
  urls: React.PropTypes.array,
  final_urls: React.PropTypes.array
}

const TextAd = ({
  kpi,
  headline,
  headline_part_1,
  headline_part_2,
  display_url,
  description,
  description_1,
  description_2,
  path_1,
  path_2,
  final_urls
}) => (
  <div className={`${style.wrapper}`}>
    <div className={`mdl-color--yellow-200 ${style.box}`}>
      {headline
        ? <h5>{headline}</h5>
        : <h6>{headline_part_1}<br/>{headline_part_2}</h6>}

      {kpi && (
        <span title={kpi.name} className={`mdl-color--${colors[kpi.status]} mdl-color-text--white ${style.kpi}`}>
          {kpi.text}
        </span>)}

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
        <div className={`${style.finalUrl}`}>
          <a className={`${style.anchor}`} href={url} title={url} target='_blank'>
            {url}
          </a>
        </div>
      </div>)}
  </div>
)

TextAd.displayName = 'Text-Ad'
TextAd.propTypes = {
  kpi: React.PropTypes.number,
  headline: React.PropTypes.string,
  headline_part_1: React.PropTypes.string,
  headline_part_2: React.PropTypes.string,
  display_url: React.PropTypes.string,
  description: React.PropTypes.string,
  description_1: React.PropTypes.string,
  description_2: React.PropTypes.string,
  final_urls: React.PropTypes.array,
  path_1: React.PropTypes.string,
  path_2: React.PropTypes.string
}

const TemplateAd = ({urls}) => (
  <div className={`${style.wrapper}`}>
    <div className={`mdl-color--yellow-200 ${style.box}`}>
      {findTemplateAdUrl(urls)}
    </div>
  </div>
)

TemplateAd.displayName = 'Template-Ad'
TemplateAd.propTypes = {
  urls: React.PropTypes.array
}

function AdGroupAd (props) {
  switch (props.type) {
    case 'EXPANDED_TEXT_AD':
    case 'TEXT_AD':
      return <TextAd {...props}/>
    case 'IMAGE_AD':
      return <ImageAd {...props}/>
    case 'TEMPLATE_AD':
      return <TemplateAd {...props}/>
    default:
      return (
        <div className={`${style.wrapper}`}>
          <div className={`mdl-color--yellow-200 ${style.box}`}>
            this bad hmmm okay
          </div>
        </div>
      )
  }
}

AdGroupAd.displayName = 'AdGroup-Ad'
AdGroupAd.propTypes = {
  type: React.PropTypes.string
}

export default styledFnComponent(AdGroupAd, style)
