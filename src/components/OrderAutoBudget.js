import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'

const style = csjs`
`

export const OrderAutoBudget = React.createClass({
  displayName: 'OrderAutoBudget',
  mixins: [styled(style)],
  render () {
    return (
      <div>
        Nope.jpeg
      </div>
    )
  }
})

export default OrderAutoBudget
