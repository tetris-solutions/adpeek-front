import React from 'react'
import {styledFnComponent} from './higher-order/styled-fn-component'
import csjs from 'csjs'

const style = csjs`
.keyword {
  text-align: center;
  line-height: 1.6em;
  margin: .3em 0;
}`

const {PropTypes} = React
const colorFor = criterion_use => criterion_use === 'NEGATIVE' ? 'mdl-color--red-900' : 'mdl-color--light-green-900'

export const Keyword = ({text, status, criterion_use, match_type}) => (
  <div className={`${style.keyword} mdl-color-text--white ${colorFor(criterion_use)}`}>
    {match_type === 'EXACT' ? `[${text}]` : text}
  </div>
)

Keyword.displayName = 'Keyword'
Keyword.propTypes = {
  text: PropTypes.string,
  status: PropTypes.string,
  criterion_use: PropTypes.string,
  match_type: PropTypes.string
}

export default styledFnComponent(Keyword, style)
