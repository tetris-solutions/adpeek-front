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
import {Container, Cap, Title, ThumbLink} from './ThumbLink'
import SubHeader, {SubHeaderButton} from './SubHeader'
import Page from './Page'
import {prettyNumber} from '../functions/pretty-number'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.strong {
  display: inline;
  white-space: nowrap;
}
.info {
  font-size: smaller;
  color: grey;
  padding: 1em;
  padding-right: 0;
}
.info > i {
  transform: translateY(.3em);
  margin-right: .3em;
}`

const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))
const dFormat = 'DD/MMM'

const Order_ = ({amount, start, end, company, workspace, folder, id, name, folder_name, workspace_name}, {moment, locales}) => (
  <ThumbLink to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${id}`} title={name}>
    <Cap>
      <strong className={`${style.strong}`}>
        {name}
      </strong>
      <br/>

      <small>
        {moment(start).format(dFormat)} - {moment(end).format(dFormat)}
      </small>
    </Cap>

    <div className={`${style.info}`}>
      <i className='material-icons'>folder</i>
      {folder_name}
      <br/>
      <i className='material-icons'>domain</i>
      {workspace_name}
    </div>

    <Title>
      {prettyNumber(amount, 'currency', locales)}
    </Title>
  </ThumbLink>
)

Order_.displayName = 'Order'
Order_.propTypes = {
  id: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  folder_name: PropTypes.string.isRequired,
  workspace_name: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  workspace: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired
}

Order_.contextTypes = {
  moment: PropTypes.func.isRequired,
  locales: PropTypes.string.isRequired
}

const Order = styledFnComponent(Order_, style)

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
