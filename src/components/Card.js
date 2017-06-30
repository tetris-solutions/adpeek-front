import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import omit from 'lodash/omit'
import {styledComponent} from './higher-order/styled'
import BaseForm from './Form'

const style = csjs`
.card {
  margin: 3em auto;
  min-width: 320px;
}
.small extends .card {
  width: 35%;
  overflow: visible;
}
.medium extends .card {
  width: 70%;
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

class Card_ extends React.Component {
  static displayName = 'Card'

  static propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    size: 'small',
    tag: 'div'
  }

  render () {
    const {size, tag: Tag} = this.props
    const subProps = omit(this.props, 'tag', 'size')

    subProps.className = `mdl-card mdl-shadow--6dp ${style[size]}`

    return (
      <Tag {...subProps}/>
    )
  }
}

export const Card = styledComponent(Card_, style)

export class Form extends React.Component {
  static displayName = 'Form'

  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  render () {
    return <Card {...this.props} tag={BaseForm}/>
  }
}

export const Content = ({children, tag: Tag, className}) => (
  <Tag className={`mdl-card__supporting-text ${style.content} ${className}`}>
    {children}
  </Tag>
)

Content.defaultProps = {
  tag: 'div',
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

export function Footer ({children}) {
  return (
    <footer className='mdl-card__actions mdl-card--border'>
      {children}
    </footer>
  )
}

Footer.displayName = 'Footer'
Footer.propTypes = {
  children: PropTypes.node
}
