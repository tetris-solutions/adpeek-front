import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Switch from '../../../Switch'
import {styledFunctionalComponent} from '../../../higher-order/styled'
import csjs from 'csjs'

const style = csjs`
.switch {
  position: relative;
  overflow: hidden;
  height: 2em;
  margin-top: .5em;
}
.switch > span {
  position: absolute;
  right: 2em;
}`

const FilterSwitch = (props, {activeOnly, toggleActiveOnly}) => (
  <div className={String(style.switch)}>
    <span>
      <Switch
        checked={activeOnly}
        onChange={toggleActiveOnly}
        label={<Message>filterActiveOnly</Message>}/>
    </span>
  </div>
)

FilterSwitch.displayName = 'Filter-Switch'
FilterSwitch.contextTypes = {
  activeOnly: PropTypes.bool.isRequired,
  toggleActiveOnly: PropTypes.func.isRequired
}

export default styledFunctionalComponent(FilterSwitch, style)
