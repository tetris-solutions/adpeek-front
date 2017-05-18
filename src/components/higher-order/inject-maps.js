import React from 'react'
import qs from 'query-string'

let mapsPromise = null
let isReady = false

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

    window[config.callback] = () => {
      isReady = true
      resolve()
    }

    script.src = mapsUrl
    script.onerror = reject

    document.body.appendChild(script)
  })

  return mapsPromise
}

export const injectMaps = Component => class InjectMaps extends React.Component {
  static displayName = `injectMaps(${Component.displayName})`

  componentDidMount () {
    if (!isReady) {
      initialize()
        .then(() => this.forceUpdate())
    }
  }

  render () {
    return isReady ? <Component {...this.props}/> : null
  }
}
