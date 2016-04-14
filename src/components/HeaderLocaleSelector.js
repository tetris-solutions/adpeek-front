import React from 'react'
import LocaleSelector from '@tetris/front-server/lib/components/LocaleSelector'

export function HeaderLocaleSelector (props) {
  return (
    <form className='navbar-form navbar-right'>
      <div className='form-group'>
        <LocaleSelector {...props} className='form-control'/>
      </div>
    </form>
  )
}

HeaderLocaleSelector.displayName = 'Header-Locale-Selector'

export default HeaderLocaleSelector
