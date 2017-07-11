import React from 'react'
import PropTypes from 'prop-types'
import head from 'lodash/head'
import Checkbox from '../../Checkbox'

class FeedItem extends React.PureComponent {
  static displayName = 'Feed-Item'

  static propTypes = {
    add: PropTypes.func,
    remove: PropTypes.func,
    feedItemId: PropTypes.string,
    checked: PropTypes.bool,
    status: PropTypes.string,
    sitelinkLine2: PropTypes.string,
    sitelinkLine3: PropTypes.string,
    sitelinkText: PropTypes.string,
    sitelinkFinalUrls: PropTypes.shape({
      urls: PropTypes.array
    })
  }

  onChange = ({target: {checked}}) => {
    if (checked) {
      this.props.add(this.props.feedItemId)
    } else {
      this.props.remove(this.props.feedItemId)
    }
  }

  render () {
    const {status, checked, feedItemId, sitelinkLine2, sitelinkLine3, sitelinkText, sitelinkFinalUrls: {urls}} = this.props
    const divProps = {
      className: 'mdl-list__item mdl-list__item--three-line',
      key: feedItemId
    }

    if (status !== 'ENABLED') {
      divProps.style = {opacity: 0.7}
      divProps.title = status
    }

    return (
      <div {...divProps}>
        <div className='mdl-list__item-primary-content'>
          <a href={head(urls)} target='_blank'>
            {sitelinkText}
          </a>
          <div className='mdl-list__item-text-body'>
            {sitelinkLine2}
            <br/>
            {sitelinkLine3}
          </div>
        </div>
        <div className='mdl-list__item-secondary-content'>
          <Checkbox
            checked={checked}
            onChange={this.onChange}
            name={`feed-item-${feedItemId}`}/>
        </div>
      </div>
    )
  }
}

export default FeedItem
