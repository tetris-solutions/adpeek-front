import React from 'react'
import ReactDOM from 'react-dom'
import isString from 'lodash/isString'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import omit from 'lodash/omit'
import {Link} from 'react-router'

const style = csjs`
.wrapper {
  width: 270px;
  padding: 10px 0;
  transition: margin-top .3s;
}
.wrapper > hr {
  width: 80%;
  margin: 0 auto;
}
.icon {
  font-size: 72px;
  display: block;
  text-align: center;
  margin: .5em 0;
}
.img {
  width: 200px;
  height: auto;
  margin: 10px auto;
  display: block;
}
.menu {
  display: block;
  text-align: center;
  margin: 0 8%;
}
.button {
  display: block;
  margin: .7em 0;
  padding: 0;
  line-height: 3.5em;
  height: auto;
  text-transform: none;
  text-align: left;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.button i {
  margin: 0 .5em 0 1em;
}
.name {
  word-wrap: break-word;
  overflow: hidden;
  margin-left: 20px;
}`

export const NavBt = props => {
  const {tag: Tag, children, icon} = props
  const otherProps = omit(props, 'tag', 'icon', 'children')
  const className = `mdl-button mdl-button--raised mdl-button--colored mdl-color--primary-dark ${style.button}`

  return (
    <Tag className={className} {...otherProps}>
      {icon ? <i className='material-icons'>{icon}</i> : null}
      {children || null}
    </Tag>
  )
}
NavBt.displayName = 'Nav-Button'
NavBt.defaultProps = {
  tag: 'a'
}
NavBt.propTypes = {
  tag: React.PropTypes.any,
  href: React.PropTypes.string,
  to: React.PropTypes.string,
  icon: React.PropTypes.string,
  onClick: React.PropTypes.func,
  children: React.PropTypes.node
}

export const NavLink = props => <NavBt {...props} tag={Link}/>
NavLink.displayName = 'Nav-Link'

export const NavBts = ({children}) => (
  <section className={`${style.menu}`}>
    {children}
  </section>
)
export const Name = ({children}) => (
  <section className={`${style.name}`}>
    <h4>
      {children}
    </h4>
  </section>
)
Name.displayName = 'Name'
NavBts.displayName = 'Nav-Buttons'

Name.propTypes = NavBts.propTypes = {
  children: React.PropTypes.node.isRequired
}

const NavContainer = ({children}) => (
  <div className={`${style.wrapper}`}>
    {children}
  </div>
)

NavContainer.displayName = 'Container'
NavContainer.propTypes = {
  children: React.PropTypes.node
}

export const Navigation = React.createClass({
  displayName: 'Navigation',
  mixins: [styled(style)],
  propTypes: {
    icon: React.PropTypes.node,
    img: React.PropTypes.string,
    children: React.PropTypes.node
  },
  componentDidMount () {
    window.event$.emit('aside-toggle')

    document.querySelector('#app main')
      .addEventListener('scroll', this.onScroll)
  },
  componentWillUnmount () {
    this.dead = true

    document.querySelector('#app main')
      .removeEventListener('scroll', this.onScroll)
  },
  onScroll () {
    window.requestAnimationFrame(() => {
      if (this.dead) return

      const nav = ReactDOM.findDOMNode(this)
      const main = document.querySelector('#app main')
      const header = document.querySelector('#app header')
      const slideHeight = main.scrollTop - header.clientHeight
      const maxSlide = nav.parentElement.clientHeight - nav.clientHeight

      nav.style.marginTop = slideHeight > 0
        ? Math.min(slideHeight, maxSlide) + 'px'
        : ''
    })
  },
  render () {
    const {icon, img, children} = this.props

    let navIcon = null

    if (img) {
      navIcon = <img className={`${style.img}`} src={img}/>
    } else if (isString(icon)) {
      navIcon = <i className={`material-icons ${style.icon}`}>{icon}</i>
    } else if (React.isValidElement(icon)) {
      navIcon = React.cloneElement(icon, {
        className: '' + style.icon
      })
    }

    return (
      <NavContainer>
        {navIcon}
        {children}
      </NavContainer>
    )
  }
})
