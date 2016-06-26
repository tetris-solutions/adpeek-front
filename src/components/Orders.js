import React from 'react'
import {ThumbLink, ThumbButton} from './ThumbLink'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {contextualize} from './higher-order/contextualize'
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
  propTypes: {
    folder: PropTypes.shape({
      orders: PropTypes.array
    }),
    location: PropTypes.object,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  },
  render () {
    const {folder, location, params: {company, workspace}} = this.props
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

          {map(folder.orders, (order, index) =>
            <Order {...order}
              key={index}
              workspace={workspace}
              company={company}
              folder={folder.id}/>)}

          <ThumbButton
            title={<Message>newOrderHeader</Message>}
            label={<Message>newOrderCallToAction</Message>}
            to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/create/order`}/>
        </div>
      </div>
    )
  }
})

export default contextualize(Orders, 'folder')
