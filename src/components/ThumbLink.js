import React from 'react'
import csjs from 'csjs'
import {Link} from 'react-router'
import {styledFnComponent} from './higher-order/styled-fn-component'
import Tooltip from 'tetris-iso/Tooltip'

const style = csjs`
.container {
  margin: 2em 6em;
}
.card {
  display: inline-block;
  position: relative;
  width: 200px;
  min-height: 200px;
  margin: 0 10px;
  text-align: left;
  border-radius: 2px;
}
.title {
  position: absolute;
  font-size: large;
  font-weight: bold;
  bottom: .7em;
  line-height: 1.2em;
  margin: 0 .7em;
}
.sad {
  background-color: rgb(240, 240, 240);
  opacity: .8;
}

.gear {
  display: inline-block;
  position: absolute;
  text-align: center;
  opacity: 0;
  cursor: pointer;
  
  background: white;
  color: grey;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  
  border-radius: 50%;
  width: 32px;
  height: 32px;
  
  padding: 0;
  top: -12px;
  right: -12px;
  transition: opacity .3s ease;
}
.gear i {
  line-height: 32px;
  transition: transform .5s ease;
}

.card:hover > .gear {
  opacity: 1;
}
.card:hover > .gear > i {
  transform: rotate(90deg);
}
.visible {
  position: relative;
  display: block;
  width: auto;
  height: auto;
}
.menu extends .visible {
  
}
.options extends .visible {
  
}
.options a {
  color: #545454 !important;
  font-size: small;
  text-decoration: none;
}
.options i {
  font-size: inherit;
  margin-right: .5em;
  transform: translateY(2px);
}
.button {
  position: absolute;
  text-transform: none;
  padding: 0 .7em;
  bottom: .7em;
  left: .7em;
}`

const {PropTypes} = React

const backgroundStyle = img => ({
  background: `url(${img}) center/cover no-repeat`
})

export const Title = ({children}) => (
  <h4 className={`mdl-color-text--blue-800 ${style.title}`}>
    {children}
  </h4>
)
Title.displayName = 'Title'
Title.propTypes = {
  children: PropTypes.node.isRequired
}

export const Button = ({children}) => (
  <span className={`mdl-button ${style.button}`}>
    {children}
  </span>
)

Button.displayName = 'Button'
Button.propTypes = {
  children: PropTypes.node.isRequired
}

export function ThumbLink ({to, title, img, children, sad}) {
  const props = {
    style: img ? backgroundStyle(img) : undefined,
    className: `mdl-shadow--2dp ${style.card} ${sad ? style.sad : ''}`,
    to
  }

  return (
    <Link {...props} title={title}>
      {children}
    </Link>
  )
}

ThumbLink.displayName = 'Thumb-Link'
ThumbLink.propTypes = {
  sad: PropTypes.bool,
  children: PropTypes.node,
  img: PropTypes.string,
  to: PropTypes.string,
  title: PropTypes.string
}

/**
 * @param {Event} e event
 * @return {undefined}
 */
function doNotBubble (e) {
  e.preventDefault()
}

export const Menu = ({children}) => (
  <span className={String(style.gear)} onClick={doNotBubble}>
    <i className='material-icons'>settings</i>
    <Tooltip hover>
      <div className={`mdl-menu__container is-visible ${style.menu}`}>
        <ul className={`mdl-menu ${style.options}`}>
          {children}
        </ul>
      </div>
    </Tooltip>
  </span>
)

Menu.displayName = 'Menu'
Menu.propTypes = {
  children: PropTypes.node.isRequired
}

export const MenuItem = ({children}) => (
  <li className='mdl-menu__item'>
    {children}
  </li>
)

MenuItem.displayName = 'Menu-Item'
MenuItem.propTypes = {
  children: PropTypes.node.isRequired
}

export function ThumbButton ({to, title, label, img}) {
  return (
    <div className={String(style.card)}>
      <div className='mdl-card mdl-shadow--2dp'>
        <div
          className={`mdl-card__title mdl-card--expand ${style.expand}`}
          style={img ? backgroundStyle(img) : undefined}>
          <h3 className='mdl-card__title-text'>
            {title}
          </h3>
        </div>
        <div className='mdl-card__actions mdl-card--border'>
          <Link className='mdl-button mdl-button--colored' to={to}>
            {label}
          </Link>
        </div>
      </div>
    </div>
  )
}

ThumbButton.displayName = 'Thumb-Button'
ThumbButton.propTypes = {
  img: PropTypes.string,
  to: PropTypes.string,
  title: PropTypes.node,
  label: PropTypes.node
}

const Parent = ({children}) => (
  <div className={String(style.container)}>
    {children}
  </div>
)
Parent.displayName = 'Container'
Parent.propTypes = {
  children: PropTypes.node
}

export const Container = styledFnComponent(Parent, style)
