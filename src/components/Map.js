import React from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'

let mapsPromise = null
const libraries = [
  'geometry',
  'drawing',
  'places'
]

const config = {
  key: process.env.GMAPS_KEY,
  callback: '_onInitGoogleMaps_',
  libraries: libraries.join(',')
}

const mapsUrl = `https://maps.googleapis.com/maps/api/js?${qs.stringify(config)}`

function initialize () {
  if (mapsPromise) {
    return mapsPromise
  }

  mapsPromise = new Promise((resolve, reject) => {
    const script = window.document.createElement('script')

    window[config.callback] = resolve

    script.src = mapsUrl
    script.onerror = reject

    document.body.appendChild(script)
  })

  return mapsPromise
}

class Map extends React.Component {
  static displayName = 'Google-Map'

  static propTypes = {
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

  componentDidMount () {
    initialize().then(this.setup)
  }

  setup = () => {
    const {disableDefaultUI, center, zoom} = this.props

    this.map = new google.maps.Map(this.refs.container, {
      center: new google.maps.LatLng(center.lat, center.lng),
      zoom,
      disableDefaultUI
    })
  }

  render () {
    const {height} = this.props

    return <div ref='container' style={{height}}/>
  }
}

export default Map
