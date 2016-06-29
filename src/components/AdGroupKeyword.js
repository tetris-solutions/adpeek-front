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

export const Keyword = ({text, status, criterion_use, match_type}) => (
  <div className={`${style.keyword} mdl-color-text--grey-900 mdl-color--grey-300`}>
    {match_type === 'EXACT' ? `[${text}]` : text}
  </div>
)

Keyword.displayName = 'AdGroup-Keyword'
Keyword.propTypes = {
  text: PropTypes.string,
  status: PropTypes.string,
  criterion_use: PropTypes.string,
  match_type: PropTypes.string
}

export default styledFnComponent(Keyword, style)
