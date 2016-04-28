import React from 'react'
import csjs from 'csjs'
import {Link} from 'react-router'

const style = csjs`
.card {
  width: 100%
}`

const {PropTypes} = React

export function ThumbLink ({to, title}, {insertCss}) {
  insertCss(style)
  return (
    <Link to={to} className='mdl-cell mdl-cell--2-col'>
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div className='mdl-card__title mdl-card--expand'>
          <h3 className='mdl-card__title-text'>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

ThumbLink.displayName = 'Thumb-Link'
ThumbLink.propTypes = {
  to: PropTypes.string,
  title: PropTypes.string
}

ThumbLink.contextTypes = {
  insertCss: PropTypes.func
}

export function ThumbButton ({to, title, label}, {insertCss}) {
  insertCss(style)
  return (
    <div className='mdl-cell mdl-cell--2-col'>
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div className='mdl-card__title mdl-card--expand'>
          <h3 className='mdl-card__title-text'>
            {title}
          </h3>
        </div>
        <div className='mdl-card__actions mdl-card--border'>
          <Link className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' to={to}>
            {label}
          </Link>
        </div>
      </div>
    </div>
  )
}

ThumbButton.displayName = 'Thumb-Button'
ThumbButton.propTypes = {
  to: PropTypes.string,
  title: PropTypes.node,
  label: PropTypes.node
}

ThumbButton.contextTypes = {
  insertCss: PropTypes.func
}
