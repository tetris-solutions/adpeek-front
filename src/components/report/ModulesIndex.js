import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import scrollTo from 'scrollto-with-animation'
import sortBy from 'lodash/sortBy'
import {DropdownMenu, MenuItem} from '../DropdownMenu'

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

  scrollTo(main, 'scrollTop', top(module) - top(main))
}

const iconFor = {
  line: 'timeline',
  column: 'insert_chart',
  table: 'view_list',
  pie: 'pie_chart',
  total: 'looks_one'
}

export const Modules = ({name, modules, exit}) =>
  <DropdownMenu position='top right outside inside'>
    {map(sortBy(modules, 'y'), ({id, name, type}) =>
      <MenuItem key={id} onClick={scrollToModule(id)} icon={iconFor[type] || 'timeline'}>
        {name}
      </MenuItem>)}
  </DropdownMenu>

Modules.displayName = 'Modules'
Modules.propTypes = {
  exit: PropTypes.func,
  name: PropTypes.string,
  modules: PropTypes.array
}
