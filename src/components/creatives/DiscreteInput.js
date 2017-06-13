import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'
import omit from 'lodash/omit'

const style = csjs`
.input {
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
}
textarea.input {
  width: 100%;
  resize: none;
  overflow: hidden;
  line-height: 1.3em;
  height: 2.6em;
}`

class DiscreteInput extends React.PureComponent {
  static displayName = 'Discrete-Input'

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    multiline: PropTypes.bool
  }

  render () {
    const Tag = this.props.multiline
      ? 'textarea'
      : 'input'

    return (
      <Tag
        className={style.input}
        type='text'
        {...omit(this.props, 'multiline')}/>
    )
  }
}

export default styledComponent(DiscreteInput, style)
