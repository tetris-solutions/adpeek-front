import React from 'react'
import csjs from 'csjs'
import {Link} from 'react-router'
import {styledFnComponent} from './higher-order/styled-fn-component'

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
