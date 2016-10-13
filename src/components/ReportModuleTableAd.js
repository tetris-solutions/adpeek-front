import endsWith from 'lodash/endsWith'
import find from 'lodash/find'
import get from 'lodash/get'
import React from 'react'

import AdCreative from './ReportModuleTableAdCreative'

const {PropTypes} = React
const TextAd = ({description, headline}) => (
  <div>
    <strong>{headline}</strong>
    <br/>
    <small>{description}</small>
  </div>
)

TextAd.displayName = 'Text-Ad'
TextAd.propTypes = {
  description: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired
}

const ImageAd = ({urls, name}) => (
  <figure>
    <img src={get(find(urls, {key: 'PREVIEW'}), 'value', 'http://placehold.it/120x120')}/>
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
  let templateDownloadUrl

  const htmlUrl = get(find(urls, {key: 'FULL'}), 'value')

  if (htmlUrl) {
    templateDownloadUrl = htmlUrl
      .replace('/sadbundle/', '/simgad/')
      .replace('/index.html', '')
  }

  return (
    <a href={templateDownloadUrl} target='_blank'>
      {name}
    </a>
  )
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
