import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'
import omit from 'lodash/omit'
import cx from 'classnames'

const style = csjs`
.input {
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
}
.fullWidth {
  display: block;
  width: 100%;
}
textarea.input {
  display: block;
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
    multiline: PropTypes.bool,
    block: PropTypes.bool
  }

  render () {
    const Tag = this.props.multiline
      ? 'textarea'
      : 'input'

    const className = cx({
      [style.input]: true,
      [style.fullWidth]: this.props.block
    })

    return (
      <Tag
        className={className}
        type='text'
        {...omit(this.props, 'multiline', 'block')}/>
    )
  }
}

export default styledComponent(DiscreteInput, style)
