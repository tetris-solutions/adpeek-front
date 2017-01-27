import React from 'react'
import {node} from './higher-order/branch'
import {pure} from 'recompose'
import AdGroupAd from './AdGroupAd'
import AdGroupKeyword from './AdGroupKeyword'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import groupBy from 'lodash/groupBy'
import Message from 'tetris-iso/Message'

const style = csjs`
.header {
  font-size: large;
  font-weight: 600;
  padding: .7em 0;
  text-align: center;
  text-shadow: 1px 2px rgba(0, 0, 0, 0.1)
}`
export const AdGroup = React.createClass({
  displayName: 'AdGroup',
  mixins: [styled(style)],
  propTypes: {
    name: React.PropTypes.string,
    ads: React.PropTypes.array,
    keywords: React.PropTypes.array
  },
  render () {
    const {name, ads, keywords} = this.props
    const criterions = groupBy(keywords, 'criterion_use')

    return (
      <div>
        <header className={`mdl-color--grey-700 mdl-color-text--white ${style.header}`}>
          {name}
        </header>
        <div>
          {map(ads, ad => <AdGroupAd key={ad.id} {...ad}/>)}
        </div>

        {criterions.BIDDABLE
          ? (
            <div>
              <h5>
                <Message>biddableKeywords</Message>
              </h5>
              {map(criterions.BIDDABLE, keyword => (
                <AdGroupKeyword key={keyword.id} {...keyword}/>
              ))}
            </div>) : null}

        {criterions.NEGATIVE
          ? (
            <div>
              <h5>
                <Message>negativeKeywords</Message>
              </h5>
              {map(criterions.NEGATIVE, keyword => (
                <AdGroupKeyword key={keyword.id} {...keyword}/>
              ))}
            </div>) : null}
      </div>
    )
  }
})

const AdGroupWrapper = props => <AdGroup {...props} {...props.adGroup}/>

AdGroupWrapper.displayName = 'AdGroup'
AdGroupWrapper.propTypes = {
  adGroup: React.PropTypes.object
}

const level = ({params}) => params.campaign ? 'campaign' : 'folder'

export default node(level, 'adGroup', pure(AdGroupWrapper))
