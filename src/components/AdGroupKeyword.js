import React from 'react'
import {styledFnComponent} from './higher-order/styled-fn-component'
import csjs from 'csjs'

const style = csjs`
.keyword {
  text-align: center;
  line-height: 1.6em;
  margin: .3em 0;
  padding: 0 .5em
}`

const {PropTypes} = React

const colors = {
  UNKNOWN: {bg: 'grey-200', text: 'grey-900'},
  BELOW_AVERAGE: {bg: 'red-200', text: 'grey-900'},
  AVERAGE: {bg: 'blue-200', text: 'grey-900'},
  ABOVE_AVERAGE: {bg: 'light-green-200', text: 'grey-900'}
}
colors.undefined = colors.UNKNOWN
colors.null = colors.UNKNOWN

export const Keyword = ({text, status, criterion_use, match_type, relevance}) => (
  <div className={`${style.keyword} mdl-color-text--${colors[relevance].text} mdl-color--${colors[relevance].bg}`}>
    {match_type === 'EXACT' ? `[${text}]` : text}
  </div>
)

Keyword.displayName = 'AdGroup-Keyword'
Keyword.propTypes = {
  relevance: PropTypes.oneOf(['UNKNOWN', 'BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE']),
  text: PropTypes.string,
  status: PropTypes.string,
  criterion_use: PropTypes.string,
  match_type: PropTypes.string
}

export default styledFnComponent(Keyword, style)
