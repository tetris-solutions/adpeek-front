import React from 'react'
import PropTypes from 'prop-types'
import isNumber from 'lodash/isNumber'
import Input from '../Input'
import {injectMaps} from '../higher-order/inject-maps'
import head from 'lodash/head'
import forEach from 'lodash/forEach'
import loglevel from 'loglevel'

let geoCoder

function preventSubmit (e) {
  if (e.which === 13) {
    e.preventDefault()
  }
}

function parseAddressComponents (components) {
  const address = {}

  forEach(components, ({long_name, short_name, types: [type, subType, metaData]}) => {
    if (type === 'postal_code') {
      address.postalCode = long_name
    }
    if (type === 'country') {
      address.countryName = long_name
      address.countryCode = short_name
    }
    if (type === 'administrative_area_level_1') {
      address.provinceName = long_name
      address.provinceCode = short_name
    }
    if (type === 'administrative_area_level_2' || type === 'locality') {
      address.cityName = long_name
    }
    if (type === 'street_number') {
      address.streetNumber = long_name
    }
    if (type === 'route') {
      address.streetAddress = long_name
    }
    if (subType === 'sublocality') {
      address.neighborhood = long_name
    }
  })

  return address
}

class GeoCode extends React.PureComponent {
  static displayName = 'AutoComplete'

  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.string.isRequired,
    lat: PropTypes.number,
    lng: PropTypes.number,
    onChangeAddress: PropTypes.func.isRequired,
    onChangePlace: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.init()

    const {lat, lng, value} = this.props

    if (!value && isNumber(lat) && isNumber(lng)) {
      this.geoCode(lat, lng)
    }
  }

  componentWillReceiveProps (nextProps) {
    const emptySearch = !nextProps.value
    const isValidCoords = isNumber(nextProps.lat) && isNumber(nextProps.lng)
    const isNewCoords = nextProps.lat !== this.props.lat || nextProps.lng !== this.props.lng

    if (emptySearch && isValidCoords && isNewCoords) {
      this.geoCode(nextProps.lat, nextProps.lng)
    }
  }

  init () {
    geoCoder = geoCoder || new google.maps.Geocoder()

    const {input} = this.refs.el

    this.autoComplete = new google.maps.places.Autocomplete(input)

    // override autoComplete widget defaults
    input.placeholder = ''

    this.autoComplete.addListener('place_changed', this.onPlacesChange)
  }

  geoCode (lat, lng) {
    const onGeoCode = (results, status) => {
      const place = head(results)

      if (!place || status !== 'OK') {
        loglevel.warning('geo code failure', {status, results})
        return
      }

      this.props.onChangePlace(
        lat,
        lng,
        place.formatted_address,
        parseAddressComponents(place.address_components)
      )
    }

    geoCoder.geocode({location: {lat, lng}}, onGeoCode)
  }

  onPlacesChange = () => {
    const place = this.autoComplete.getPlace()

    if (place.geometry) {
      this.props.onChangePlace(
        place.geometry.location.lat(),
        place.geometry.location.lng(),
        place.formatted_address,
        parseAddressComponents(place.address_components)
      )
    }
  }

  onChange = (e) => {
    this.props.onChangeAddress(e.target.value)
  }

  render () {
    return (
      <Input
        ref='el'
        type='search'
        disabled={this.props.disabled}
        onKeyDown={preventSubmit}
        onChange={this.onChange}
        value={this.props.value}
        name='autoComplete'
        label='location'/>
    )
  }
}

export default injectMaps(GeoCode)
