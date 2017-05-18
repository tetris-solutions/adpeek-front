import React from 'react'
import PropTypes from 'prop-types'
import {injectMaps} from '../higher-order/inject-maps'

class Map extends React.Component {
  static displayName = 'Google-Map'

  static propTypes = {
    children: PropTypes.node,
    center: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    zoom: PropTypes.number,
    height: PropTypes.number,
    disableDefaultUI: PropTypes.bool
  }

  static defaultProps = {
    disableDefaultUI: true,
    height: 400,
    center: {
      lat: -22.9941854,
      lng: -43.4230734
    },
    zoom: 11
  }

  static childContextTypes = {
    map: PropTypes.object
  }

  getChildContext () {
    return {
      map: this.map
    }
  }

  componentDidMount () {
    this.setup()
  }

  setup = () => {
    const {disableDefaultUI, center, zoom} = this.props

    this.map = new google.maps.Map(this.refs.container, {
      center: new google.maps.LatLng(center.lat, center.lng),
      zoom,
      disableDefaultUI
    })

    this.forceUpdate()
  }

  render () {
    const {children, height} = this.props

    return (
      <div ref='container' style={{height}}>
        {children}
      </div>
    )
  }
}

export default injectMaps(Map)
