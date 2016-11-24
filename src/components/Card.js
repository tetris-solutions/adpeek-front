import React from 'react'
import {Submit} from './Button'
import csjs from 'csjs'
import omit from 'lodash/omit'
import {styled} from './mixins/styled'

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

export const Card = React.createClass({
  display: 'Card',
  mixins: [styled(style)],
  propTypes: {
    size: PropTypes.oneOf(['small', 'large', 'full']),
    tag: PropTypes.string,
    children: PropTypes.node.isRequired
  },
  getDefaultProps () {
    return {
      size: 'small',
      tag: 'div'
    }
  },
  render () {
    const {children, size, tag: Tag} = this.props
    const subProps = omit(this.props, 'tag')

    return (
      <Tag className={`mdl-card mdl-shadow--6dp ${style[size]}`} {...subProps}>
        {children}
      </Tag>
    )
  }
})

export const Form = React.createClass({
  displayName: 'Form',
  propTypes: {
    onSubmit: PropTypes.func.isRequired
  },
  render () {
    return <Card {...this.props} tag='form'/>
  }
})

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
        <Submit className='mdl-button mdl-button--colored'>
          {children}
        </Submit>)}
    </footer>
  )
}

Footer.displayName = 'Footer'
Footer.propTypes = {
  multipleButtons: PropTypes.bool,
  children: PropTypes.node
}
