import React from 'react'
import csjs from 'csjs'
import omit from 'lodash/omit'
import assign from 'lodash/assign'
import {styled} from './mixins/styled'

const style = csjs`
.card {
  margin: 3em auto;
}
.small extends .card {
  width: 35%;
  overflow: visible;
}
.large extends .card {
  width: 90%;
}
.small > .content {
  overflow: visible;
  width: 90%;
  margin: .5em auto;
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
  displayName: 'Card',
  mixins: [styled(style)],
  getDefaultProps () {
    return {
      size: 'small',
      tag: 'div'
    }
  },
  propTypes: {
    size: PropTypes.oneOf(['small', 'large']),
    tag: PropTypes.string,
    children: PropTypes.node
  },
  render () {
    const {children, size, tag} = this.props

    const props = omit(this.props, 'tag')

    return React.createElement(tag, assign(props, {
      className: `mdl-card mdl-shadow--6dp ${style[size]}`
    }), children)
  }
})

export const Form = React.createClass({
  displayName: 'Form',
  propTypes: {
    onSubmit: PropTypes.func,
    children: PropTypes.node
  },
  render () {
    return <Card {...this.props} tag='form'/>
  }
})

export function Content ({children, tag, className}) {
  return React.createElement(tag, {
    className: `mdl-card__supporting-text ${style.content} ${className}`
  }, children)
}

Content.defaultProps = {
  tag: 'section',
  className: ''
}
Content.displayName = 'Content'
Content.propTypes = {
  tag: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
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
  children: PropTypes.node
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
