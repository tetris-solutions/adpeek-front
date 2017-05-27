import React from 'react'
import PropTypes from 'prop-types'
import {styledFunctionalComponent} from './higher-order/styled'
import csjs from 'csjs'

const style = csjs`
.well {
  border: 1px solid #ccc;
  border-radius: 2px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
  padding: 25px;
  margin: 20px 0;
}`

const Well = ({children}) => (
  <div className={`mdl-color--grey-100 ${style.well}`}>
    {children}
  </div>
)

Well.displayName = 'Well'
Well.propTypes = {
  children: PropTypes.node
}

export default styledFunctionalComponent(Well, style)
