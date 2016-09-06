import window from 'global/window'
import React from 'react'

const {PropTypes} = React

export const Slide = React.createClass({
  displayName: 'Slide',
  propTypes: {
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
  },
  getDefaultProps () {
    return {
      step: 0.5
    }
  },
  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.input)
    this.refs.input.addEventListener('change', this.props.onChange)
  },
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
  },
  shouldComponentUpdate () {
    return false
  },
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
})

export default Slide
