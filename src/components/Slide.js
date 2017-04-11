import React from 'react'

import PropTypes from 'prop-types'

export class Slide extends React.Component {
  static displayName = 'Slide'

  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
  }

  static defaultProps = {
    step: 0.5
  }

  componentDidMount () {
    const {input} = this.refs

    window.componentHandler.upgradeElement(input)
    input.addEventListener('input', this.props.onChange)
  }

  componentWillReceiveProps ({value, min, max, step}) {
    const {input} = this.refs
    if (
      value !== Number(input.value) ||
      min !== Number(input.min) ||
      step !== Number(input.step) ||
      max !== Number(input.max)
    ) {
      input.min = min
      input.max = max
      input.step = step
      input.MaterialSlider.change(value)
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const {name, step, value, min, max} = this.props
    return (
      <input
        ref='input'
        name={name}
        step={step}
        defaultValue={value}
        className='mdl-slider mdl-js-slider'
        type='range'
        min={min}
        max={max}/>
    )
  }
}

export default Slide
