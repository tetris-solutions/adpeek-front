import React from 'react'
import PropTypes from 'prop-types'

const scalar = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

class Radio extends React.PureComponent {
  static displayName = 'Radio'

  static propTypes = {
    onChange: PropTypes.func,
    children: PropTypes.node,
    checked: PropTypes.bool,
    name: scalar.isRequired,
    id: scalar.isRequired,
    value: scalar
  }

  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.wrapper)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.checked !== this.props.checked) {
      const {MaterialRadio} = this.refs.wrapper

      if (nextProps.checked) {
        MaterialRadio.check()
      } else {
        MaterialRadio.uncheck()
      }
    }
  }

  render () {
    const {onChange, children, checked, name, id, value} = this.props

    return (
      <label className='mdl-radio mdl-js-radio' htmlFor={id} ref='wrapper'>
        <input
          type='radio'
          className='mdl-radio__button'
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}/>
        {children}
      </label>
    )
  }
}

export default Radio
