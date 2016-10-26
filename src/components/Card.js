import React from 'react'
import csjs from 'csjs'
import omit from 'lodash/omit'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.card {
  margin: 3em auto;
}
.small extends .card {
  width: 35%;
  min-width: 320px;
  overflow: visible;
}
.large extends .card {
  width: 90%;
}
.full extends .card {
  width: 100%;
  margin: 0;
}
.small > .content {
  overflow: visible;
  width: 90%;
  margin: .5em auto;
}
.full > .content {
  margin: 2em auto;
  padding: 0;
  width: 94%;
}
.large > .content {
  width: 90%;
  margin: .5em auto;
  overflow-y: auto;
}
.content > div {
  width: 100%;
}`

const {PropTypes} = React

const Card_ = props => {
  const {children, size, tag: Tag} = props
  const subProps = omit(props, 'tag')

  return (
    <Tag className={`mdl-card mdl-shadow--6dp ${style[size]}`} {...subProps}>
      {children}
    </Tag>
  )
}

Card_.displayName = 'Card'
Card_.propTypes = {
  size: PropTypes.oneOf(['small', 'large', 'full']),
  tag: PropTypes.string,
  children: PropTypes.node.isRequired
}
Card_.defaultProps = {
  size: 'small',
  tag: 'div'
}

export const Card = styledFnComponent(Card_, style)

export const Form = props => <Card {...props} tag='form'/>

Form.displayName = 'Form'
Form.propTypes = {
  onSubmit: PropTypes.func,
  children: PropTypes.node
}

export const Content = ({children, tag: Tag, className}) => (
  <Tag className={`mdl-card__supporting-text ${style.content} ${className}`}>
    {children}
  </Tag>
)

Content.defaultProps = {
  tag: 'section',
  className: ''
}
Content.displayName = 'Content'
Content.propTypes = {
  tag: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

export function Header ({children, color, textColor}) {
  return (
    <header className={`mdl-card__title mdl-color--${color} mdl-color-text--${textColor}`}>
      <h3 className='mdl-card__title-text'>
        {children}
      </h3>
    </header>
  )
}

Header.defaultProps = {
  color: 'primary',
  textColor: 'white'
}
Header.displayName = 'Header'
Header.propTypes = {
  color: PropTypes.string,
  textColor: PropTypes.string,
  children: PropTypes.node.isRequired
}

export function Footer ({children, multipleButtons}) {
  return (
    <footer className='mdl-card__actions mdl-card--border'>
      {multipleButtons ? children : (
        <button type='submit' className='mdl-button mdl-button--colored'>
          {children}
        </button>)}
    </footer>
  )
}

Footer.displayName = 'Footer'
Footer.propTypes = {
  multipleButtons: PropTypes.bool,
  children: PropTypes.node
}
