import endsWith from 'lodash/endsWith'
import React from 'react'
import PropTypes from 'prop-types'
import {findTemplateAdUrl} from '../../../functions/find-template-ad-url'
import {findImageAdUrl} from '../../../functions/find-image-ad-url'

import AdCreative from './TableCreative'
const TextAd = ({description, description_2, headline}) => (
  <div>
    <strong>{headline}</strong>
    <br/>
    <small>{description}</small>
    <br/>
    <small>{description_2}</small>
  </div>
)

TextAd.displayName = 'Text-Ad'
TextAd.propTypes = {
  description: PropTypes.string.isRequired,
  description_2: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired
}

const ImageAd = ({urls, name}) => (
  <figure>
    <img src={findImageAdUrl(urls) || 'http://placehold.it/120x120'}/>
    <figcaption>{name}</figcaption>
  </figure>
)

ImageAd.displayName = 'Image-Ad'
ImageAd.propTypes = {
  name: PropTypes.string.isRequired,
  urls: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string
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
  urls: PropTypes.array,
  name: PropTypes.string.isRequired
}

function ReportModuleTableAd (props) {
  const {id, name, type} = props

  if (props.creative_id) {
    return <AdCreative {...props} />
  }

  if (endsWith(type, 'TEXT_AD')) {
    return <TextAd {...props} />
  }

  if (type === 'RESPONSIVE_SEARCH_AD') {
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
  id: PropTypes.string.isRequired,
  creative_id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  headline: PropTypes.string
}

export default ReportModuleTableAd
