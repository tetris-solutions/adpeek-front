import React from 'react'
import csjs from 'csjs'
import {Link} from 'react-router'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.card {
  width: 100%
}`

const {PropTypes} = React

function TLink ({to, title}) {
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

TLink.displayName = 'Thumb-Link'
TLink.propTypes = {
  to: PropTypes.string,
  title: PropTypes.string
}

function TButton ({to, title, label}) {
  return (
    <div className='mdl-cell mdl-cell--2-col'>
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div className='mdl-card__title mdl-card--expand'>
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

TButton.displayName = 'Thumb-Button'
TButton.propTypes = {
  to: PropTypes.string,
  title: PropTypes.node,
  label: PropTypes.node
}

export const ThumbLink = styledFnComponent(TLink, style)
export const ThumbButton = styledFnComponent(TButton, style)
