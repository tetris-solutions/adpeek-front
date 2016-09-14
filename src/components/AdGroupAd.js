import React from 'react'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
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
}
.box > h6 {
  font-weight: 500;
}
.box > h5, .box > h6 {
  margin: .7em 0 .5em;
}`

const {PropTypes} = React

const doNothing = e => e.preventDefault()

const AdGroupAd = ({
  id,
  headline,
  headline_part_1,
  headline_part_2,
  display_url,
  description,
  description_1,
  description_2,
  final_urls
}) => (
  <div className={`${style.wrapper}`}>
    <div className={`mdl-color--yellow-200 ${style.box}`}>
      <h5>
        {headline_part_1 || headline}
        {headline_part_2 ? <br/> : null}
        {headline_part_2 || null}
      </h5>
      <a href='#' onClick={doNothing}>
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
  final_urls: PropTypes.array
}

export default styledFnComponent(AdGroupAd, style)
