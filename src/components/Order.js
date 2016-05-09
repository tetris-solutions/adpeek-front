import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import OrderSelector from './OrdersSelector'
import HeaderSearchBox from './HeaderSearchBox'
import OrderEdit from './OrderEdit'

// const {PropTypes} = React

export const Order = React.createClass({
  displayName: 'Order',
  onEnter () {
    // @todo filter by campaign
  },
  handleSubmit (e) {
    e.preventDefault()
  },
  render () {
    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <span>
              <OrderSelector/>
            </span>
            <div className='mdl-layout-spacer'/>
            <button className='mdl-button mdl-color-text--grey-100'>
              <Message>saveCallToAction</Message>
            </button>
            <HeaderSearchBox onEnter={this.onEnter}/>
          </div>
        </header>
        <OrderEdit />
      </div>
    )
  }
})

export default Order
