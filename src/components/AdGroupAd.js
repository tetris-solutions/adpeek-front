import React from 'react'
import map from 'lodash/map'
import isNumber from 'lodash/isNumber'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'
import compact from 'lodash/compact'
import join from 'lodash/join'
import startsWith from 'lodash/startsWith'
import {prettyNumber} from '../functions/pretty-number'

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
}`

const w3 = 'www.'
const stripW3 = str => startsWith(str, w3) ? str.substr(w3.length) : str

function inferDisplayUrl (final_urls, path_1, path_2) {
  if (!final_urls || !final_urls[0]) return null

  const path_0 = final_urls[0]
    .replace(/.*?:\/\//g, '')
    .split('/')[0]

  const url = join(compact([`www.${stripW3(path_0)}`, path_1, path_2]), '/')

  return url.replace(/\/$/g, '')
}

function KPI ({kpi_name, kpi_positive, kpi_goal, kpi_metric, value}, {locales}) {
  if (!kpi_metric || !isNumber(value)) return null

  if (kpi_metric.type === 'percentage') {
    kpi_goal = kpi_goal / 100
  }

  let color = 'grey-800'

  if (isNumber(kpi_goal)) {
    if (kpi_positive) {
      color = value > kpi_goal ? 'light-green-900' : 'red-900'
    } else {
      color = value > kpi_goal ? 'red-900' : 'light-green-900'
    }
  }

  return (
    <span title={kpi_name} className={`mdl-color--${color} mdl-color-text--white ${style.kpi}`}>
      {prettyNumber(value, kpi_metric.type, locales)}
    </span>
  )
}

KPI.displayName = 'KPI'
KPI.propTypes = {
  kpi_name: React.PropTypes.string.isRequired,
  kpi_positive: React.PropTypes.bool.isRequired,
  kpi_goal: React.PropTypes.number.isRequired,
  kpi_metric: React.PropTypes.shape({
    type: React.PropTypes.string
  }).isRequired,
  value: React.PropTypes.number.isRequired
}

KPI.contextTypes = {
  locales: React.PropTypes.string
}

function AdGroupAd ({
  folder,
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
}) {
  display_url = display_url || inferDisplayUrl(final_urls, path_1, path_2)

  return (
    <div className={`${style.wrapper}`}>
      <div className={`mdl-color--yellow-200 ${style.box}`}>
        {headline
          ? <h5>{headline}</h5>
          : <h6>{headline_part_1}<br/>{headline_part_2}</h6>}

        <KPI
          kpi_name={folder.kpi_name}
          kpi_positive={folder.kpi_positive}
          kpi_goal={folder.kpi_goal}
          kpi_metric={folder.kpi_metric}
          value={kpi}/>

        <a className={`${style.anchor}`} title={display_url} href={`http://${display_url}`} target='_blank'>
          {display_url}
        </a>

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
}

AdGroupAd.displayName = 'AdGroup-Ad'
AdGroupAd.propTypes = {
  id: React.PropTypes.string,
  folder: React.PropTypes.object,
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

export default styledFnComponent(AdGroupAd, style)
