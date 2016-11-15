import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import SearchBox from './HeaderSearchBox'
import {Container} from './ThumbLink'
import SubHeader, {SubHeaderButton} from './SubHeader'
import Page from './Page'
import Order from './OrderThumb'
const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

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
    const matchesSearchTerm = ({name, folder_name, workspace_name}) => (
      includes(cleanStr(name), searchValue) ||
      includes(cleanStr(folder_name), searchValue) ||
      includes(cleanStr(workspace_name), searchValue)
    )
    const matchingOrders = searchValue ? filter(orders, matchesSearchTerm) : orders

    return (
      <Fence canEditOrder>{({canEditOrder}) =>
        <div>
          <SubHeader>
            {canEditOrder && Boolean(params.folder) && (
              <SubHeaderButton
                tag={Link}
                to={`/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/create/order`}>
                <i className='material-icons'>add</i>
                <Message>newOrderHeader</Message>
              </SubHeaderButton>)}

            {canEditOrder && (
              <SubHeaderButton tag={Link} to={`${location.pathname}/clone`}>
                <Message>cloneOrders</Message>
              </SubHeaderButton>)}
            <SearchBox onChange={this.onChange}/>
          </SubHeader>
          <Page>
            <Container>
              <h5>
                <Message>orders</Message>
              </h5>
              {map(matchingOrders, (order, index) =>
                <Order {...order} key={index}/>)}
            </Container>
          </Page>
        </div>}
      </Fence>
    )
  }
})

export default Orders
