import React from 'react'
import PropTypes from 'prop-types'
import {styledFunctionalComponent} from '../higher-order/styled'
import csjs from 'csjs'

const style = csjs`
.keyword {
  text-align: center;
  line-height: 1.6em;
  margin: .3em 0;
  padding: 0 .5em
}`

const colorPerQualityScore = {
  UNKNOWN: {bg: 'grey-200', text: 'grey-900'},
  BELOW_AVERAGE: {bg: 'red-200', text: 'grey-900'},
  AVERAGE: {bg: 'blue-200', text: 'grey-900'},
  ABOVE_AVERAGE: {bg: 'light-green-200', text: 'grey-900'}
}

const color = qualityScore => colorPerQualityScore[qualityScore] || colorPerQualityScore.UNKNOWN

export const Keyword = ({text, match_type, relevance}) => (
  <div className={`${style.keyword} mdl-color-text--${color(relevance).text} mdl-color--${color(relevance).bg}`}>
    {match_type === 'EXACT' ? `[${text}]` : text}
  </div>
)

Keyword.displayName = 'AdGroup-Keyword'
Keyword.propTypes = {
  relevance: PropTypes.oneOf(['UNKNOWN', 'BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE']),
  text: PropTypes.string,
  status: PropTypes.string,
  match_type: PropTypes.string
}

export default styledFunctionalComponent(Keyword, style)
