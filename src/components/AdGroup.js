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
import upper from 'lodash/toUpper'

const style = csjs`
.header {
  font-size: large;
  font-weight: 600;
  padding: .7em 0;
  text-align: center;
}`
export const AdGroup = React.createClass({
  displayName: 'AdGroup',
  mixins: [styled(style)],
  propTypes: {
    folder: React.PropTypes.object,
    status: React.PropTypes.string,
    name: React.PropTypes.string,
    ads: React.PropTypes.array,
    keywords: React.PropTypes.array
  },
  render () {
    const {name, status, ads, keywords, folder} = this.props
    const criterions = groupBy(keywords, 'criterion_use')
    let color, textColor

    switch (upper(status)) {
      case 'REMOVED':
        color = 'grey-300'
        textColor = 'grey-500'
        break
      case 'PAUSED':
        color = 'grey-400'
        textColor = 'grey-700'
        break
      default:
        color = 'grey-700'
        textColor = 'white'
    }

    return (
      <div>
        <header
          title={status}
          className={`mdl-color--${color} mdl-color-text--${textColor} ${style.header}`}>
          {name}
        </header>
        <div>
          {map(ads, ad => <AdGroupAd key={ad.id} {...ad} folder={folder}/>)}
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
