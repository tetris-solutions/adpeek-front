import deburr from 'lodash/deburr'
import orderBy from 'lodash/orderBy'
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
import Switch from './Switch'
const cleanStr = str => trim(deburr(lowerCase(str)))

export const Orders = React.createClass({
  displayName: 'Orders',
  contextTypes: {
    moment: React.PropTypes.func.isRequired,
    location: React.PropTypes.object,
    params: React.PropTypes.shape({
      company: React.PropTypes.string,
      workspace: React.PropTypes.string,
      folder: React.PropTypes.string
    })
  },
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    orders: React.PropTypes.array.isRequired
  },
  getInitialState () {
    return {
      searchValue: '',
      activeOnly: true
    }
  },
  onChange (searchValue) {
    this.setState({searchValue})
  },
  onSwitch ({target: {checked: activeOnly}}) {
    this.setState({activeOnly})
  },
  render () {
    const {activeOnly} = this.state
    const searchValue = cleanStr(this.state.searchValue)
    const {location, params, moment} = this.context
    const today = moment().format('YYYY-MM-DD')

    const orders = activeOnly
      ? filter(this.props.orders, ({start, end}) => start <= today && end >= today)
      : this.props.orders

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
              <span style={{float: 'right'}}>
                <Switch
                  checked={this.state.activeOnly}
                  name='activeOrdersOnly'
                  label={<Message>filterActiveOnly</Message>}
                  onChange={this.onSwitch}/>
              </span>

              <h5>
                <Message>orders</Message>
              </h5>
              {map(orderBy(matchingOrders, ['creation'], ['desc']), (order, index) =>
                <Order {...order} dispatch={this.props.dispatch} key={index}/>)}
            </Container>
          </Page>
        </div>}
      </Fence>
    )
  }
})

export default Orders
