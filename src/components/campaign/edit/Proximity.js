import React from 'react'
import PropTypes from 'prop-types'
// import Message from 'tetris-iso/Message'
import Input from '../../Input'
import keys from 'lodash/keys'

const unitAbbr = {
  KILOMETERS: 'Km',
  MILES: 'Miles'
}

class EditProximity extends React.Component {
  static displayName = 'Edit-Proximity'

  static propTypes = {
    id: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    unit: PropTypes.oneOf(keys(unitAbbr)),
    radius: PropTypes.number,
    address: PropTypes.shape({
      streetAddress: PropTypes.string,
      streetAddress2: PropTypes.string,
      cityName: PropTypes.string,
      provinceCode: PropTypes.string,
      provinceName: PropTypes.string,
      postalCode: PropTypes.string,
      countryCode: PropTypes.string
    }),
    update: PropTypes.func
  }

  static defaultProps = {
    unit: 'KILOMETERS'
  }

  onChangeRadius = ({target: {value: radius}}) => {
    this.props.update({radius})
  }

  render () {
    const {radius, unit} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--8-col'>
          <Input name='address'/>
        </div>
        <div className='mdl-cell mdl-cell--4-col'>
          <Input
            name='radius'
            label={`radiusIn${unitAbbr[unit]}`}
            value={radius}
            onChange={this.onChangeRadius}
            type='number'/>
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          map goes here
        </div>
      </div>
    )
  }
}

export default EditProximity
