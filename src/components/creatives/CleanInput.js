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

class CleanInput extends React.PureComponent {
  static displayName = 'Clean-Input'

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    multiline: PropTypes.bool,
    block: PropTypes.bool
  }

  onKeyUp = e => {
    if (e.keyCode === 27) {
      /**
       * @type {HTMLInputElement}
       */
      const el = this.refs.el
      el.blur()
    }

    if (this.props.onKeyUp) {
      this.props.onKeyUp(e)
    }
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
        ref='el'
        className={className}
        type='text'
        onKeyUp={this.onKeyUp}
        {...omit(this.props, 'multiline', 'block')}/>
    )
  }
}

export default styledComponent(CleanInput, style)
