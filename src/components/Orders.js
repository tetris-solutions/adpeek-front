import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import SearchBox from './HeaderSearchBox'
import {ThumbLink, ThumbButton} from './ThumbLink'

const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

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
  getInitialState () {
    return {
      searchValue: ''
    }
  },
  onChange (searchValue) {
    this.setState({searchValue})
  },
  render () {
    const searchValue = cleanStr(this.state.searchValue)
    const {location, params} = this.context
    const {orders} = this.props
    const matchingOrders = searchValue
      ? filter(orders, ({name}) => includes(cleanStr(name), searchValue))
      : orders

    return (
      <Fence APEditOrders>{({allow: canEditOrders}) =>
        <div>
          <header className='mdl-layout__header'>
            <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
              <Message>orders</Message>
              <div className='mdl-layout-spacer'/>

              {canEditOrders && (
                <Link className='mdl-button mdl-color-text--grey-100' to={`${location.pathname}/clone`}>
                  <Message>cloneOrders</Message>
                </Link>)}

              <SearchBox onChange={this.onChange}/>
            </div>
          </header>
          <div className='mdl-grid'>

            {map(matchingOrders, (order, index) =>
              <Order {...order} key={index}/>)}

            {canEditOrders && Boolean(params.folder) && (
              <ThumbButton
                title={<Message>newOrderHeader</Message>}
                label={<Message>newOrderCallToAction</Message>}
                to={`/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/create/order`}/>)}
          </div>
        </div>}
      </Fence>
    )
  }
})

export default Orders
