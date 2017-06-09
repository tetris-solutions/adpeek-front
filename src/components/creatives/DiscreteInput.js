import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'

const style = csjs`
.input {
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
}`

class DiscreteInput extends React.PureComponent {
  static displayName = 'Discrete-Input'

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  render () {
    return (
      <input
        className={style.input}
        type='text'
        {...this.props}/>
    )
  }
}

export default styledComponent(DiscreteInput, style)
