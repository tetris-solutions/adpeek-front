import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

class Circle extends React.PureComponent {
  static displayName = 'Circle'

  static propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    strokeColor: PropTypes.string,
    strokeOpacity: PropTypes.number,
    strokeWeight: PropTypes.number,
    fillColor: PropTypes.string,
    fillOpacity: PropTypes.number
  }

  static contextTypes = {
    map: PropTypes.object
  }

  static defaultProps = {
    strokeColor: '#920f0f',
    strokeOpacity: 0.7,
    strokeWeight: 2,
    fillColor: '#0006f1',
    fillOpacity: 0.3
  }

  componentDidMount () {
    this.circle = new google.maps.Circle(this.getOptions())
  }

  componentWillUnmount () {
    this.circle.setMap(null)
  }

  componentDidUpdate () {
    this.circle.setOptions(this.getOptions())
  }

  getOptions () {
    const options = omit(this.props, 'lat', 'lng')

    options.center = new google.maps.LatLng(this.props.lat, this.props.lng)
    options.map = this.context.map

    return options
  }

  render () {
    return null
  }
}

export default Circle
