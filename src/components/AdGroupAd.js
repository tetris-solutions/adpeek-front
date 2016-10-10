import React from 'react'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'

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
  margin-top: 1em;
  padding: .7em;
  overflow: hidden;
  text-overflow: ellipsis;
}
.box a {
  white-space: normal;
}
.box > h6 {
  margin: 0 0 .5em;
  font-weight: 500;
}
.box > h5 {
  margin: .7em 0 .5em;
}`

const {PropTypes} = React

function inferDisplayUrl (final_urls, path_1, path_2) {
  if (!final_urls || !final_urls[0]) return null

  const path_0 = final_urls[0]
    .replace(/.*?:\/\//g, '')
    .split('/')[0]

  const url = `www.${path_0}/${path_1}/${path_2}`

  return url.replace(/\/$/g, '')
}

const AdGroupAd = ({
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
}) => {
  display_url = display_url || inferDisplayUrl(final_urls, path_1, path_2)

  return (
    <div className={`${style.wrapper}`}>
      <div className={`mdl-color--yellow-200 ${style.box}`}>
        {headline
          ? <h5>{headline}</h5>
          : <h6>{headline_part_1} - {headline_part_2}</h6>}

        <a href={`http://${display_url}`} target='_blank'>
          {display_url}
        </a>

        <div>{description || description_1}</div>

        {description_2
          ? <div>{description_2}</div>
          : null}
      </div>

      {map(final_urls,
        (url, index) => (
          <div className={`mdl-color--yellow-200 ${style.box}`} key={index}>
            <strong>
              <Message>finalUrl</Message>
            </strong>
            <br/>
            <div className={`${style.finalUrl}`}>
              <a href={url} target='_blank'>
                {url}
              </a>
            </div>
          </div>
        ))}
    </div>
  )
}

AdGroupAd.displayName = 'AdGroup-Ad'
AdGroupAd.propTypes = {
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

export default styledFnComponent(AdGroupAd, style)
