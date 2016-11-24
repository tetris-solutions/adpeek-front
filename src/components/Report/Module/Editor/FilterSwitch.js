import React from 'react'
import Message from 'tetris-iso/Message'
import Switch from '../../../Switch'
import {styledFnComponent} from '../../../higher-order/styled-fn-component'
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
  activeOnly: React.PropTypes.bool.isRequired,
  toggleActiveOnly: React.PropTypes.func.isRequired
}

export default styledFnComponent(FilterSwitch, style)