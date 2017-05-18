import React from 'react'
import PropTypes from 'prop-types'
import isNumber from 'lodash/isNumber'
import Input from '../Input'
import {injectMaps} from '../higher-order/inject-maps'

let geoCoder

class GeoCode extends React.PureComponent {
  static displayName = 'AutoComplete'

  static propTypes = {
    value: PropTypes.string.isRequired,
    lat: PropTypes.number,
    lng: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onPlaceSelected: PropTypes.func.isRequired
  }

  componentDidMount () {
    geoCoder = geoCoder || new google.maps.Geocoder()

    const {input} = this.refs.el

    this.autoComplete = new google.maps.places.Autocomplete(input)

    input.placeholder = ''

    this.autoComplete.addListener('place_changed', this.onPlacesChange)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.value && isNumber(nextProps.lat)) {
      this.geoCode(nextProps.lat, nextProps.lng)
    }
  }

  onPlacesChange = () => {
    const place = this.autoComplete.getPlace()

    if (place.geometry) {
      this.props.onPlaceSelected(place)
    } else {

    }
  }

  onChange = (e) => {
    this.props.onChange(e)
  }

  geoCode (lat, lng) {
    // geoCoder.geoCode()
  }

  render () {
    return (
      <Input
        ref='el'
        onChange={this.onChange}
        value={this.props.value}
        name='autoComplete'
        label='location'/>
    )
  }
}

export default injectMaps(GeoCode)
