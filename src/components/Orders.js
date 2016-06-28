import React from 'react'
import {ThumbLink, ThumbButton} from './ThumbLink'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {Link} from 'react-router'

const {PropTypes} = React

function Order ({company, workspace, folder, id, name}) {
  return <ThumbLink to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${id}`} title={name}/>
}

Order.displayName = 'Order'
Order.propTypes = {
  id: PropTypes.string,
  workspace: PropTypes.string,
  company: PropTypes.string,
  folder: PropTypes.string,
  name: PropTypes.string
}

export const Orders = React.createClass({
  displayName: 'Orders',
  contextTypes: {
    location: PropTypes.object,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  },
  propTypes: {
    orders: PropTypes.array
  },
  render () {
    const {location, params} = this.context
    const {orders} = this.props

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message>orders</Message>
            <div className='mdl-layout-spacer'/>
            <Link className='mdl-button mdl-color-text--grey-100' to={`${location.pathname}/clone`}>
              <Message>cloneOrders</Message>
            </Link>
          </div>
        </header>
        <div className='mdl-grid'>

          {map(orders, (order, index) =>
            <Order {...order} key={index}/>)}

          {params.folder && (
            <ThumbButton
              title={<Message>newOrderHeader</Message>}
              label={<Message>newOrderCallToAction</Message>}
              to={`/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/create/order`}/>)}

        </div>
      </div>
    )
  }
})

export default Orders
