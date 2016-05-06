import React from 'react'
import Select from './Select'
import map from 'lodash/map'

const {PropTypes} = React
const orders = [{id: '0123', name: 'PI Outubro'}, {id: '0456', name: 'PI Março'}]

export const OrdersSelector = React.createClass({
  displayName: 'Orders-Selector',
  contextTypes: {
    router: PropTypes.object,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string,
      order: PropTypes.string
    })
  },
  onChange ({target: {value}}) {
    const {router, params: {company, workspace, folder}} = this.context
    const relative = `/company/${company}/workspace/${workspace}/folder/${folder}`

    if (value) {
      router.push(`${relative}/order/${value}`)
    } else {
      router.push(`${relative}/create/order`)
    }
  },
  render () {
    return (
      <Select name='order' value={this.context.params.order || ''} onChange={this.onChange}>
        <option value=''>Create order</option>

        {map(orders, ({id, name}) => (
          <option key={id} value={id}>
            {name}
          </option>))}
      </Select>
    )
  }
})

export default OrdersSelector
