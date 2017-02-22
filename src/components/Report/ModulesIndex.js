import React from 'react'
import map from 'lodash/map'
import scrollTo from 'scrollto-with-animation'
import {NavBts, NavBt} from '../Navigation'
import sortBy from 'lodash/sortBy'
import {Button} from '../Button'
import Message from 'tetris-iso/Message'

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
  <NavBts>{map(sortBy(modules, 'y'), ({id, name, type}) =>
    <NavBt key={id} tag={Button} onClick={scrollToModule(id)} icon={iconFor[type] || 'timeline'}>
      {name}
    </NavBt>)}

    <NavBt tag={Button} onClick={exit} icon='close'>
      <Message>oneLevelUpNavigation</Message>
    </NavBt>
  </NavBts>

Modules.displayName = 'Modules'
Modules.propTypes = {
  exit: React.PropTypes.func,
  name: React.PropTypes.string,
  modules: React.PropTypes.array
}
