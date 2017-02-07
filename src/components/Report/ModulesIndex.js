import React from 'react'
import Message from 'tetris-iso/Message'
import {NavBt} from '../Navigation'
import {collection} from '../higher-order/branch'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import map from 'lodash/map'
import scrollTo from 'scrollto-with-animation'
import sortBy from 'lodash/sortBy'
import {styledFnComponent} from '../higher-order/styled-fn-component'
import csjs from 'csjs'

const style = csjs`
.item {
  display: block;
  max-width: 15em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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

  scrollTo(main, 'scrollTop', top(module) - top(main))
}

let Modules = ({modules}) =>
  <DropdownMenu>{map(sortBy(modules, 'y'), ({id, name}) =>
    <MenuItem onClick={scrollToModule(id)} key={id}>
      <span title={name} className={`${style.item}`}>
        {name}
      </span>
    </MenuItem>)}
  </DropdownMenu>

Modules.displayName = 'Modules'
Modules.propTypes = {
  modules: React.PropTypes.array
}
Modules = collection('report', 'modules', Modules)

const ModulesIndex = props => (
  <NavBt icon='list'>
    <Message>moduleIndexLabel</Message>
    <Modules/>
  </NavBt>
)

ModulesIndex.displayName = 'Modules-Index'

export default styledFnComponent(ModulesIndex, style)
