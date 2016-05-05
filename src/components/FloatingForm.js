import React from 'react'
import csjs from 'csjs'

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
  height: 50vh;
  overflow-y: auto;
}
.content > div {
  width: 100%;
}`

const {PropTypes} = React

export const Form = React.createClass({
  displayName: 'Form',
  getDefaultProps () {
    return {
      size: 'small'
    }
  },
  propTypes: {
    size: PropTypes.oneOf(['small', 'large']),
    onSubmit: PropTypes.func,
    children: PropTypes.node
  },
  contextTypes: {
    insertCss: PropTypes.func
  },
  render () {
    const {onSubmit, children, size} = this.props
    const {insertCss} = this.context

    insertCss(style)

    return (
      <form className={`mdl-card mdl-shadow--6dp ${style[size]}`} onSubmit={onSubmit}>
        {children}
      </form>
    )
  }
})

export function Content ({children}) {
  return (
    <section className={`mdl-card__supporting-text ${style.content}`}>
      {children}
    </section>
  )
}

Content.displayName = 'Content'
Content.propTypes = {
  children: PropTypes.node
}

export function Header ({children}) {
  return (
    <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
      <h3 className='mdl-card__title-text'>
        {children}
      </h3>
    </header>
  )
}

Header.displayName = 'Header'
Header.propTypes = {
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
