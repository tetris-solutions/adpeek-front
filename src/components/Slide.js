import React from 'react'

export const Slide = React.createClass({
  displayName: 'Slide',
  propTypes: {
    onChange: React.PropTypes.func,
    name: React.PropTypes.string,
    value: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number
  },
  getDefaultProps () {
    return {
      step: 0.5
    }
  },
  componentDidMount () {
    const {input} = this.refs

    window.componentHandler.upgradeElement(input)
    input.addEventListener('input', this.props.onChange)
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
