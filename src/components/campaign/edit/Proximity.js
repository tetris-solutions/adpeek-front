import React from 'react'
import PropTypes from 'prop-types'
// import Message from 'tetris-iso/Message'
import Input from '../../Input'
import AutoComplete from '../../maps/AutoComplete'
import keys from 'lodash/keys'
import Map from '../../maps/Map'
import Marker from '../../maps/Marker'

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

  state = {
    searchValue: '',
    suggestions: []
  }

  onChangeRadius = ({target: {value: radius}}) => {
    this.props.update({radius})
  }

  onChangeAddress = searchValue => {
    this.setState({searchValue})
  }

  onChangePlace = (lat, lng, searchValue, address) => {
    this.props.update({
      address,
      lat,
      lng
    })

    this.setState({searchValue})
  }

  onMarkerMove = (lat, lng) => {
    this.props.update({lat, lng})

    this.setState({
      searchValue: ''
    })
  }

  render () {
    const {lat, lng, radius, unit} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--8-col'>
          <AutoComplete
            lat={lat}
            lng={lng}
            value={this.state.searchValue}
            onChangePlace={this.onChangePlace}
            onChangeAddress={this.onChangeAddress}/>
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
          <Map>
            {lat !== undefined && (
              <Marker lat={lat} lng={lng} move={this.onMarkerMove}/>)}
          </Map>
        </div>
      </div>
    )
  }
}

export default EditProximity
