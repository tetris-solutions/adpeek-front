import React from 'react'
import csjs from 'csjs'
import {Link} from 'react-router'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.container {
  margin: 2em 6em;
}
.container > h5 {
  color: #7d7d7d;
  font-weight: bold;
}
.bottom {
  position: absolute;
  bottom: .7em;
  left: .7em;
  right: .7em;
}
.card {
  background: white;
  display: inline-block;
  position: relative;
  width: 230px;
  min-height: 230px;
  margin: 10px;
  text-align: left;
  border-radius: 2px;
  text-decoration: none !important;
}
.cap {
  position: relative;
  font-weight: bold;
  font-size: medium;
  width: 100%;
  height: calc(2.4em + .7em + 1em);
  line-height: 1.2em;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
.cap > span {
  position: absolute;
  bottom: .7em;
  max-height: calc(1.2em * 2);
  overflow: hidden;
  left: .7em;
  right: .5em;
  text-overflow: ellipsis;
}
.title extends .bottom {
  font-size: large;
  font-weight: bold;
  line-height: 1.2em;
  margin: 0;
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

.card:hover > .gear, .gear[data-active] {
  opacity: 1;
}

.card:hover > .gear > i, .gear[data-active] > i {
  transform: rotate(90deg);
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

export const BottomLine = ({children}) => (
  <div className={`${style.bottom}`}>
    {children}
  </div>
)

BottomLine.displayName = 'Bottom-Line'
BottomLine.propTypes = {
  children: PropTypes.node.isRequired
}

export const Title = ({children}) => (
  <h4 className={`mdl-color-text--blue-800 ${style.title}`}>
    {children}
  </h4>
)

Title.displayName = 'Title'
Title.propTypes = {
  children: PropTypes.node.isRequired
}

export const Cap = ({children}) => (
  <div className={`mdl-color--primary-dark mdl-color-text--white ${style.cap}`}>
    <span>
      {children}
    </span>
  </div>
)

Cap.displayName = 'Cap'
Cap.propTypes = {
  children: PropTypes.node
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

export const Gear = ({children}) => (
  <span className={String(style.gear)} onClick={doNotBubble}>
    <i className='material-icons'>settings</i>
    {children}
  </span>
)

Gear.displayName = 'Gear'
Gear.propTypes = {
  children: PropTypes.node.isRequired
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
