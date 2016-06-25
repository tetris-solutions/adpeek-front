import React from 'react'
import AdGroupAd from './AdGroupAd'
import AdGroupKeyword from './AdGroupKeyword'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.header {
  font-size: large;
  font-weight: 600;
  padding: .7em 0;
  text-align: center;
  text-shadow: 1px 2px rgba(0, 0, 0, 0.1)
}`
const {PropTypes} = React

export const AdGroup = React.createClass({
  displayName: 'AdGroup',
  mixins: [styled(style)],
  propTypes: {
    name: PropTypes.string,
    ads: PropTypes.array,
    keywords: PropTypes.array
  },
  render () {
    const {name, ads, keywords} = this.props

    return (
      <div>
        <header className={`mdl-color--grey-700 mdl-color-text--white ${style.header}`}>
          {name}
        </header>
        <div>
          {map(ads, ad => (
            <AdGroupAd key={ad.id} {...ad}/>
          ))}
        </div>
        <div>
          {map(keywords, keyword => (
            <AdGroupKeyword key={keyword.id} {...keyword}/>
          ))}
        </div>
      </div>
    )
  }
})

export default AdGroup
