import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../Input'
import AutoComplete from '../../maps/AutoComplete'
import keys from 'lodash/keys'
import Map from '../../maps/Map'
import Marker from '../../maps/Marker'
import Circle from '../../maps/Circle'
import compact from 'lodash/compact'
import join from 'lodash/join'
import isNumber from 'lodash/isNumber'

const unitAbbr = {
  KILOMETERS: 'Km',
  MILES: 'Miles'
}

const unitMultiplier = {
  KILOMETERS: 1000,
  MILES: 1609.34
}

function stringifyAddressComponents (addr) {
  addr = addr || {}

  return join(compact([
    addr.streetAddress,
    addr.streetNumber,
    addr.neighborhood,
    addr.cityName,
    addr.provinceCode,
    addr.countryCode
  ]), ', ')
}

class EditProximity extends React.Component {
  static displayName = 'Edit-Proximity'

  static propTypes = {
    id: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    draft: PropTypes.bool,
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
    draft: false
  }

  state = {
    searchValue: stringifyAddressComponents(this.props.address),
    suggestions: []
  }

  onChangeRadius = ({target: {value: radius}}) => {
    this.props.update({radius})
  }

  onChangeAddress = searchValue => {
    this.setState({searchValue})
  }

  onChangePlace = (lat, lng, searchValue, address) => {
    this.setState({searchValue}, () => this.props.update({
      address,
      lat,
      lng
    }))
  }

  onMarkerMove = (lat, lng) => {
    this.setState({searchValue: ''}, () => this.props.update({lat, lng}))
  }

  render () {
    const {lat, lng, radius, unit, draft} = this.props
    const validCoords = isNumber(lat) && isNumber(lng)

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--8-col'>
          <AutoComplete
            disabled={!draft}
            lat={lat}
            lng={lng}
            value={this.state.searchValue}
            onChangePlace={this.onChangePlace}
            onChangeAddress={this.onChangeAddress}/>
        </div>
        <div className='mdl-cell mdl-cell--4-col'>
          <Input
            disabled={!draft}
            name='radius'
            label={`radiusIn${unitAbbr[unit]}`}
            value={radius}
            onChange={this.onChangeRadius}
            type='number'/>
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          <Map>
            {validCoords && (
              <Marker
                draggable={draft}
                lat={lat}
                lng={lng}
                move={this.onMarkerMove}
                centered/>)}

            {validCoords && (
              <Circle
                lat={lat}
                lng={lng}
                radius={radius * unitMultiplier[unit]}/>)}
          </Map>
        </div>
      </div>
    )
  }
}

export default EditProximity
