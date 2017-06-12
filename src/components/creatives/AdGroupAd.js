import React from 'react'
import PropTypes from 'prop-types'
import {styledComponent} from '../higher-order/styled'
import {style} from './AdUtils'
import TextAd from './TextAd'
import ImageAd from './ImageAd'
import TemplateAd from './TemplateAd'
import YouTubeAd from './YouTubeAd'

class AdGroupAd extends React.Component {
  static displayName = 'AdGroup-Ad'
  static propTypes = {
    type: PropTypes.string
  }
  render () {
    let content = null

    switch (this.props.type) {
      case 'EXPANDED_TEXT_AD':
      case 'TEXT_AD':
        content = <TextAd {...this.props}/>
        break
      case 'IMAGE_AD':
        content = <ImageAd {...this.props}/>
        break
      case 'TEMPLATE_AD':
        content = <TemplateAd {...this.props}/>
        break
      case 'YOUTUBE':
        content = <YouTubeAd {...this.props}/>
        break
    }

    return (
      <div>
        {content}
      </div>
    )
  }
}

export default styledComponent(AdGroupAd, style)
