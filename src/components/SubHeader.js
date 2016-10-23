import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import {styledFnComponent} from './higher-order/styled-fn-component'
import csjs from 'csjs'

const style = csjs`
.row {
  padding: 0 30px;  
}`
const {PropTypes} = React

const SubHeader = ({title, children}) => (
  <header className='mdl-layout__header'>
    <div className={`mdl-layout__header-row mdl-color--primary-dark ${style.row}`}>
      <Breadcrumbs title={title}/>
      <div className='mdl-layout-spacer'/>
      <span>{children}</span>
    </div>
  </header>
)

SubHeader.displayName = 'Sub-Header'
SubHeader.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node
}

export default styledFnComponent(SubHeader, style)
