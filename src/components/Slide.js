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
  },
  componentWillReceiveProps ({value}) {
    if (value !== this.props.value) {
      this.refs.input.MaterialSlider.change(value)
    }
  },
  render () {
    const {name, value, min, max, onChange} = this.props
    return (
      <input
        ref='input'
        name={name}
        value={value}
        onChange={onChange}
        className='mdl-slider mdl-js-slider'
        type='range'
        min={min}
        max={max}/>
    )
  }
})

export default Slide
