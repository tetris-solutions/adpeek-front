import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import scrollTo from 'scrollto-with-animation'
import sortBy from 'lodash/sortBy'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import {styledFunctionalComponent} from '../higher-order/styled'
import csjs from 'csjs'

const style = csjs`
.menu {
  max-height: 336px;
  overflow-y: auto;
}`

/**
 *
 * @param {HTMLElement} el elem
 * @return {Number} scroll top
 */
function top (el) {
  return el.getBoundingClientRect().top
}

const scrollToModule = id => () => {
  const main = document.querySelector('#main')
  const module = main.querySelector(`[data-module-id="${id}"]`)

  if (!module) return

  scrollTo(main, 'scrollTop',
    module.previousElementSibling // just scroll all the way up for the first module
      ? (top(module) + main.scrollTop) - top(main) - 5
      : 0)
}

const iconFor = {
  line: 'timeline',
  column: 'insert_chart',
  table: 'view_list',
  pie: 'pie_chart',
  total: 'looks_one'
}

const _Modules = ({name, modules, exit}) =>
  <DropdownMenu position='top right inside outside' className={style.menu}>
    {map(sortBy(modules, 'y'), ({id, name, type}) =>
      <MenuItem key={id} onClick={scrollToModule(id)} icon={iconFor[type] || 'timeline'}>
        {name}
      </MenuItem>)}
  </DropdownMenu>

_Modules.displayName = 'Modules'
_Modules.propTypes = {
  exit: PropTypes.func,
  name: PropTypes.string,
  modules: PropTypes.array
}

export const Modules = styledFunctionalComponent(_Modules, style)
