import React from 'react'
import PropTypes from 'prop-types'
import {style} from './AdUtils'
import {inferDisplayUrl, finalUrlsDomain} from '../../functions/infer-display-url'
import CleanInput from './CleanInput'
import isString from 'lodash/isString'

const DisplayUrlAnchor = ({clickable, url, children, style: css}) => (
  <a
    className={style.anchor}
    title={url}
    href={clickable ? `http://${url}` : undefined}
    target='_blank'
    style={css}>

    {children || url}
  </a>
)
DisplayUrlAnchor.displayName = 'Display-URL-Anchor'
DisplayUrlAnchor.propTypes = {
  style: PropTypes.object,
  clickable: PropTypes.bool,
  url: PropTypes.string,
  children: PropTypes.node
}

export function DisplayUrl ({display_url, final_urls, path_1, path_2, editMode, onChange}, {messages}) {
  if (isString(display_url)) {
    return (
      <DisplayUrlAnchor url={display_url} clickable={!editMode}>
        {editMode && (
          <CleanInput
            style={{width: '100%'}}
            name='display_url'
            value={display_url}
            onChange={onChange}
            placeholder={messages.displayUrlPlaceholder}/>)}
      </DisplayUrlAnchor>
    )
  }

  display_url = inferDisplayUrl(final_urls, path_1, path_2)

  return (
    <DisplayUrlAnchor url={display_url} clickable={!editMode} style={editMode ? {fontSize: 'x-small'} : undefined}>
      {editMode
        ? finalUrlsDomain(final_urls)
        : display_url}

      {editMode && ' / '}

      {editMode && (
        <CleanInput
          name='path_1'
          style={{width: 60}}
          maxLength={15}
          value={path_1}
          onChange={onChange}/>)}

      {editMode && ' / '}

      {editMode && (
        <CleanInput
          name='path_2'
          style={{width: 60}}
          maxLength={15}
          value={path_2}
          onChange={onChange}/>)}
    </DisplayUrlAnchor>
  )
}

DisplayUrl.displayName = 'Display-URL'
DisplayUrl.propTypes = {
  display_url: PropTypes.string,
  final_urls: PropTypes.array,
  path_1: PropTypes.string,
  path_2: PropTypes.string,
  editMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}
DisplayUrl.contextTypes = {
  messages: PropTypes.object
}

export default DisplayUrl
