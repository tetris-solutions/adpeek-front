import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {branch} from 'baobab-react/higher-order'
import map from 'lodash/map'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import {styled} from './mixins/styled'
import Checkbox from './Checkbox'
import csjs from 'csjs'
import find from 'lodash/find'
import assign from 'lodash/assign'
import sortBy from 'lodash/sortBy'
import EditableRow from './OrdersCloneEditableRow'
import EditableHeader from './OrdersCloneEditableHeader'
import MessageFormat from 'intl-messageformat'
import {cloneOrderAction} from '../actions/clone-order'
import {loadOrdersAction} from '../actions/load-orders'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'

const style = csjs`
.table {
  width: 100%;
  margin: 2em 0 0
}`

const {PropTypes} = React

const ClonableRow = ({name, id, start, end, amount}) => (
  <tr>
    <td className='mdl-data-table__cell--non-numeric'>
      <Checkbox name={id}/>
    </td>
    <td className='mdl-data-table__cell--non-numeric'>
      {name}
    </td>
    <td className='mdl-data-table__cell--non-numeric'>
      {start}
    </td>
    <td className='mdl-data-table__cell--non-numeric'>
      {end}
    </td>
    <td>{amount.toFixed(2)}</td>
  </tr>
)

ClonableRow.displayName = 'Clonable-Row'
ClonableRow.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  amount: PropTypes.number
}

export const OrdersClone = React.createClass({
  displayName: 'Orders-Clone',
  mixins: [FormMixin, styled(style)],
  propTypes: {
    dispatch: PropTypes.func,
    orders: PropTypes.array
  },
  contextTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object,
    messages: PropTypes.shape({
      copyOfOrderName: PropTypes.string
    }),
    locales: PropTypes.any
  },
  getInitialState () {
    return {
      selectedOrders: null
    }
  },
  componentWillMount () {
    const orderId = this.context.location.query.order
    if (!orderId) return

    const {orders} = this.props
    const order = find(orders, {id: orderId})

    if (!order) return

    this.setState({
      selectedOrders: [this.getCopyOf(order)]
    })
  },
  getCopyOf (order) {
    const {locales, messages: {copyOfOrderName}} = this.context

    return assign({}, order, {
      id: null,
      clonedOrderId: order.id,
      name: new MessageFormat(copyOfOrderName, locales).format({name: order.name})
    })
  },
  /**
   * @param {HTMLFormElement} form the form el
   * @return {undefined}
   */
  cloneOrders (form) {
    const {params} = this.context
    const {dispatch} = this.props
    const promises = map(this.state.selectedOrders,
      ({clonedOrderId, folder}, index) =>
        dispatch(cloneOrderAction, clonedOrderId, {
          folder: folder,
          name: form.elements[`${index}.name`].value,
          start: form.elements[`${index}.start`].value,
          end: form.elements[`${index}.end`].value,
          amount: form.elements[`${index}.amount`].value,
          auto_budget: form.elements[`${index}.autoBudget`].checked
        }))

    return Promise.all(promises)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() =>
        dispatch(loadOrdersAction,
          params.company,
          params.workspace,
          params.folder))
      .then(() => {
        let orderListUrl = `/company/${params.company}`
        if (params.workspace) {
          orderListUrl += `/workspace/${params.workspace}`
          if (params.folder) {
            orderListUrl += `/folder/${params.folder}`
          }
        }
        orderListUrl += '/orders'

        this.context.router.push(orderListUrl)
      })
  },
  /**
   * @param {HTMLFormElement} form the form el
   * @return {undefined}
   */
  selectOrders (form) {
    const selectedOrders = []
    const gone = {}
    const {orders} = this.props

    for (const key in form.elements) {
      const input = form.elements[key]
      if (input && input.type === 'checkbox' && input.checked) {
        const order = find(orders, {id: input.name})

        if (order && !gone[order.id]) {
          gone[order.id] = true
          selectedOrders.push(this.getCopyOf(order))
        }
      }
    }

    this.setState({selectedOrders})
  },
  handleSubmit (e) {
    e.preventDefault()

    if (this.state.selectedOrders) {
      this.cloneOrders(e.target)
    } else {
      this.selectOrders(e.target)
    }
  },
  render () {
    const {selectedOrders} = this.state
    const {orders} = this.props
    const hasSelected = Boolean(selectedOrders)

    return (
      <form onSubmit={this.handleSubmit}>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message>cloneOrders</Message>
            <div className='mdl-layout-spacer'/>

            <button className='mdl-button mdl-color-text--grey-100' type='submit'>
              {hasSelected
                ? <Message>save</Message>
                : <Message>selectOrders</Message>}
            </button>
          </div>
        </header>
        <div className='mdl-grid'>
          <div className='mdl-cell--12-col'>
            {hasSelected && selectedOrders.length > 1 && (
              <EditableHeader/>
            )}
            <table className={`${style.table} mdl-data-table mdl-data-table--selectable mdl-shadow--2dp`}>
              <thead>
                <tr>
                  <th className='mdl-data-table__cell--non-numeric'>
                    ✓
                  </th>
                  <th className='mdl-data-table__cell--non-numeric'>
                    <Message>nameLabel</Message>
                  </th>
                  <th className='mdl-data-table__cell--non-numeric'>
                    <Message>startDateLabel</Message>
                  </th>
                  <th className='mdl-data-table__cell--non-numeric'>
                    <Message>endDateLabel</Message>
                  </th>
                  <th className={hasSelected ? 'mdl-data-table__cell--non-numeric' : ''}>
                    <Message>investmentLabel</Message>
                  </th>
                  {hasSelected && <th>Auto Budget</th>}
                </tr>
              </thead>
              <tbody>
                {map(selectedOrders || sortBy(orders, 'start').reverse(),
                  (order, index) => hasSelected
                    ? <EditableRow key={index} {...order} index={index}/>
                    : <ClonableRow key={order.id} {...order}/>)}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    )
  }
})

export default branch({}, OrdersClone)
