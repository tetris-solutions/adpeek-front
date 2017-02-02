import React from 'react'
import Message from 'tetris-iso/Message'
import {NavBt} from '../Navigation'
import {collection} from '../higher-order/branch'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import map from 'lodash/map'

let Modules = ({modules}) =>
  <DropdownMenu>{map(modules, ({id, name}) =>
    <MenuItem key={id}>
      {name}
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

export default ModulesIndex
