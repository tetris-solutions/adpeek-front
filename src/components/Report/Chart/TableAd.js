import endsWith from 'lodash/endsWith'
import React from 'react'
import {findTemplateAdUrl} from '../../../functions/find-template-ad-url'
import {findImageAdUrl} from '../../../functions/find-image-ad-url'

import AdCreative from './TableCreative'
const TextAd = ({description, headline}) => (
  <div>
    <strong>{headline}</strong>
    <br/>
    <small>{description}</small>
  </div>
)

TextAd.displayName = 'Text-Ad'
TextAd.propTypes = {
  description: React.PropTypes.string.isRequired,
  headline: React.PropTypes.string.isRequired
}

const ImageAd = ({urls, name}) => (
  <figure>
    <img src={findImageAdUrl(urls, 'http://placehold.it/120x120')}/>
    <figcaption>{name}</figcaption>
  </figure>
)

ImageAd.displayName = 'Image-Ad'
ImageAd.propTypes = {
  name: React.PropTypes.string.isRequired,
  urls: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string,
    value: React.PropTypes.string
  }))
}

function TemplateAd ({urls, name}) {
  const templateDownloadUrl = findTemplateAdUrl(urls)

  return templateDownloadUrl
    ? (
      <a href={templateDownloadUrl} target='_blank'>
        {name}
      </a>
    )
    : <span>{name}</span>
}

TemplateAd.displayName = 'Template-Ad'
TemplateAd.propTypes = {
  urls: React.PropTypes.array,
  name: React.PropTypes.string.isRequired
}

function ReportModuleTableAd (props) {
  const {id, name, type} = props

  if (props.creative_id) {
    return <AdCreative {...props} />
  }

  if (endsWith(type, 'TEXT_AD')) {
    return <TextAd {...props} />
  }

  if (type === 'IMAGE_AD') {
    return <ImageAd {...props} />
  }

  if (type === 'TEMPLATE_AD') {
    return <TemplateAd {...props} />
  }

  return (
    <span>
      {name || id}
    </span>
  )
}

ReportModuleTableAd.displayName = 'Report-Module-Table-Ad'
ReportModuleTableAd.propTypes = {
  id: React.PropTypes.string.isRequired,
  creative_id: React.PropTypes.string,
  name: React.PropTypes.string,
  type: React.PropTypes.string,
  description: React.PropTypes.string,
  headline: React.PropTypes.string
}

export default ReportModuleTableAd
