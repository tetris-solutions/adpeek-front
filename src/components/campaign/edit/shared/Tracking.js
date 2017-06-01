import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Input from '../../../Input'
import map from 'lodash/map'

class Tracking extends React.PureComponent {
  static displayName = 'Tracking'

  static propTypes = {
    extensionName: PropTypes.oneOf(['app', 'sitelink']),
    urlCustomParameters: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render () {
    const {extensionName} = this.props
    const trackingUrlPropName = `${extensionName}TrackingUrlTemplate`

    return (
      <div style={{maxWidth: 400, margin: '0 auto'}}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              name={trackingUrlPropName}
              label='trackingUrlTemplate'
              type='url'
              value={this.props[trackingUrlPropName]}
              onChange={this.props.onChange}/>
          </div>
        </div>

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h6><Message>urlCustomParameters</Message></h6>
          </div>
        </div>

        {map(this.props.urlCustomParameters, ({key, value}, index) => (
          <div key={index} className='mdl-grid'>
            <div className='mdl-cell mdl-cell--5-col'>
              <Input
                name={`urlCustomParameters.${index}.key`}
                label='urlCustomParameterKey'
                value={key}
                onChange={this.props.onChange}/>
            </div>
            <div className='mdl-cell mdl-cell--7-col'>
              <Input
                name={`urlCustomParameters.${index}.value`}
                label='urlCustomParameterValue'
                value={value}
                onChange={this.props.onChange}/>
            </div>
          </div>))}
      </div>
    )
  }
}

export default Tracking
