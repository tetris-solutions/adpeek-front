import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {contextualize} from './higher-order/contextualize'
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

const style = csjs`
.table {
  width: 100%;
  margin: 2em 0 0
}`

const {PropTypes} = React

const ClonableRow = ({name, id, start, end, amount}) => (
  <tr>
    <td>
      <Checkbox name={id}/>
    </td>
    <td>{name}</td>
    <td>{start}</td>
    <td>{end}</td>
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
    folder: PropTypes.shape({
      orders: PropTypes.array
    })
  },
  contextTypes: {
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
  /**
   * @param {HTMLFormElement} form the form el
   * @return {undefined}
   */
  cloneOrders (form) {
    // const {selectedOrders} = this.state
  },
  /**
   * @param {HTMLFormElement} form the form el
   * @return {undefined}
   */
  selectOrders (form) {
    const {locales, messages: {copyOfOrderName}} = this.context
    const selectedOrders = []
    const gone = {}
    const {folder: {orders}} = this.props

    for (const key in form.elements) {
      const input = form.elements[key]
      if (input && input.type === 'checkbox' && input.checked) {
        const order = find(orders, {id: input.name})

        if (order && !gone[order.id]) {
          gone[order.id] = true
          const newOrder = assign({}, order, {
            id: null,
            clone: order.id,
            name: new MessageFormat(copyOfOrderName, locales).format({name: order.name})
          })
          selectedOrders.push(newOrder)
        }
      }
    }

    this.setState({selectedOrders})
  },
  handleSubmit (e) {
    e.preventDefault()
    if (this.state.selectedOrders) {

    } else {
      this.selectOrders(e.target)
    }
  },
  render () {
    const {selectedOrders} = this.state
    const {folder: {orders}} = this.props
    const hasSelected = Boolean(selectedOrders)

    return (
      <form onSubmit={this.handleSubmit}>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message>cloneOrders</Message>
            <div className='mdl-layout-spacer'/>

            <button className='mdl-button mdl-color-text--grey-100' type='submit'>
              {hasSelected
                ? <Message>saveCallToAction</Message>
                : <Message>selectOrders</Message>}
            </button>
          </div>
        </header>
        <div className='mdl-grid'>
          <div className='mdl-cell--12-col'>
            {hasSelected && (
              <EditableHeader/>
            )}
            <table className={`${style.table} mdl-data-table mdl-data-table--selectable mdl-shadow--2dp`}>
              <thead>
                <tr>
                  <th className='mdl-data-table__cell--non-numeric'>Select</th>
                  <th className='mdl-data-table__cell--non-numeric'>Name</th>
                  <th className='mdl-data-table__cell--non-numeric'>Start</th>
                  <th className='mdl-data-table__cell--non-numeric'>End</th>
                  <th className={hasSelected ? 'mdl-data-table__cell--non-numeric' : ''}>
                    Investment
                  </th>
                  {hasSelected && <th>AutoBudget</th>}
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

export default contextualize(OrdersClone, 'folder')
