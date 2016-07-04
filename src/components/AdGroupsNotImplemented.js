import React from 'react'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'
import Message from '@tetris/front-server/lib/components/intl/Message'

const style = csjs`
.notImplementedCard {
  margin: 2em auto;
  background-color: rgb(250, 250, 250)
}`

export const AdGroupsNotImplemented = () => (
  <div className={`mdl-card mdl-shadow--2dp ${style.notImplementedCard}`}>
    <div className='mdl-card__title mdl-card--expand'>
      <h4>
        <Message>notYetImplemented</Message>
      </h4>
    </div>
  </div>
)

AdGroupsNotImplemented.displayName = 'AdGroups-Not-Implemented'

export default styledFnComponent(AdGroupsNotImplemented, style)
