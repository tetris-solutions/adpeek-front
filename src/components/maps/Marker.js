import React from 'react'
import PropTypes from 'prop-types'

class Marker extends React.PureComponent {
  static displayName = 'Marker'

  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    draggable: PropTypes.bool,
    centered: PropTypes.bool,
    move: PropTypes.func
  }

  static contextTypes = {
    map: PropTypes.object
  }

  static defaultProps = {
    draggable: true
  }

  componentDidMount () {
    const {lat, lng, draggable, centered} = this.props

    this.marker = new google.maps.Marker({
      draggable,
      position: new google.maps.LatLng(lat, lng),
      map: this.context.map
    })

    if (draggable) {
      this.marker.addListener('dragend', this.onDragEnd)
    }

    if (centered) {
      this.focus()
    }
  }

  componentWillUnmount () {
    this.marker.setMap(null)
  }

  componentDidUpdate () {
    this.marker.setPosition(
      new google.maps.LatLng(this.props.lat, this.props.lng)
    )

    if (this.props.centered) {
      this.focus()
    }
  }

  focus () {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      this.context.map.panTo(new google.maps.LatLng(this.props.lat, this.props.lng))
      this.context.map.setZoom(12)
    }, 1000)
  }

  onDragEnd = () => {
    const positon = this.marker.getPosition()

    this.props.move(
      positon.lat(),
      positon.lng()
    )
  }

  render () {
    return null
  }
}

export default Marker
