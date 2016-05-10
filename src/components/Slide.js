import React from 'react'
import window from 'global/window'

const {PropTypes} = React

export const Slide = React.createClass({
  displayName: 'Slide',
  propTypes: {
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number
  },
  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.input)
    this.refs.input.addEventListener('change', this.props.onChange)
  },
  componentWillReceiveProps ({value, min, max}) {
    const {input} = this.refs
    if (
      value !== Number(input.value) ||
      min !== Number(input.min) ||
      max !== Number(input.max)
    ) {
      input.min = min
      input.max = max
      input.MaterialSlider.change(value)
    }
  },
  shouldComponentUpdate () {
    return false
  },
  render () {
    const {name, value, min, max} = this.props
    return (
      <input
        ref='input'
        name={name}
        defaultValue={value}
        className='mdl-slider mdl-js-slider'
        type='range'
        min={min}
        max={max}/>
    )
  }
})

export default Slide
