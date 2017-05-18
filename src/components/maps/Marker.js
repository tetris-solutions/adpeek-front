import React from 'react'
import PropTypes from 'prop-types'

class Marker extends React.PureComponent {
  static displayName = 'Marker'

  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    draggable: PropTypes.bool
  }

  static contextTypes = {
    map: PropTypes.object
  }

  static defaultProps = {
    draggable: true
  }

  componentDidMount () {
    const {lat, lng, draggable} = this.props

    this.marker = new google.maps.Marker({
      draggable,
      position: new google.maps.LatLng(lat, lng),
      map: this.context.map
    })
  }

  componentWillUnmount () {
    this.marker.setMap(null)
  }

  componentDidUpdate () {
    this.marker.setPosition(
      new google.maps.LatLng(this.props.lat, this.props.lng)
    )
  }

  render () {
    return null
  }
}

export default Marker
