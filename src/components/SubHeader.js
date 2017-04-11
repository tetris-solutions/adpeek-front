import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from './Breadcrumbs'
import {styledFnComponent} from './higher-order/styled-fn-component'
import csjs from 'csjs'
import omit from 'lodash/omit'

const style = csjs`
.row {
  padding: 0 30px;  
}
.row a,
.row button {
  text-transform: none;
}`
export const SubHeaderButton = props => {
  const {tag: Tag, children} = props

  return (
    <Tag className='mdl-button mdl-color-text--white' {...omit(props, 'tag', 'children')}>
      {children}
    </Tag>
  )
}

SubHeaderButton.displayName = 'Sub-Header-Button'
SubHeaderButton.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
}

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
