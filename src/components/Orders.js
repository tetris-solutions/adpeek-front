import React from 'react'
import {ThumbLink, ThumbButton} from './ThumbLink'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React
const orders = [{id: '0123', name: 'PI Outubro'}, {id: '0456', name: 'PI Março'}]

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
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  },
  render () {
    const {params: {company, workspace, folder}} = this.props
    return (
      <div>
        <div className='mdl-grid'>
          {map(orders, (order, index) =>
            <Order key={index} {...order} workspace={workspace} company={company} folder={folder}/>)}

          <ThumbButton
            title={<Message>newOrderHeader</Message>}
            label={<Message>newOrderCallToAction</Message>}
            to={`/company/${company}/workspace/${workspace}/folder/${folder}/create/order`}/>
        </div>
      </div>
    )
  }
})

export default Orders
