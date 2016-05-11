import React from 'react'
import {ThumbLink, ThumbButton} from './ThumbLink'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {contextualize} from './higher-order/contextualize'

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
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  },
  render () {
    const {folder, params: {company, workspace}} = this.props
    return (
      <div>
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
