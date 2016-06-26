import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {contextualize} from './higher-order/contextualize'
import map from 'lodash/map'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import {styled} from './mixins/styled'
import Input from './Input'
import Checkbox from './Checkbox'
import csjs from 'csjs'
import find from 'lodash/find'
import assign from 'lodash/assign'
import sortBy from 'lodash/sortBy'

const style = csjs`
.table {
  margin: 2em auto 0 auto
}`

const {PropTypes} = React

const Clonable = ({name, id, start, end, amount}) => (
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

Clonable.displayName = 'Clonable'
Clonable.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  amount: PropTypes.number
}

const Editable = ({index, name, start, end, amount}) => (
  <tr>
    <td>
      <Input name={`${index}.name`} defaultValue={name}/>
    </td>
    <td>
      <Input type='date' name={`${index}.start`} defaultValue={start}/>
    </td>
    <td>
      <Input type='date' name={`${index}.end`} defaultValue={end}/>
    </td>
    <td>
      <Input type='number' name={`${index}.amount`} defaultValue={amount}/>
    </td>
  </tr>
)

Editable.displayName = 'Editable'
Editable.propTypes = {
  index: PropTypes.number,
  name: PropTypes.string,
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
    const selectedOrders = []
    const gone = {}
    const {folder: {orders}} = this.props

    for (const key in form.elements) {
      const input = form.elements[key]
      if (input && input.type === 'checkbox' && input.checked) {
        const order = find(orders, {id: input.name})

        if (order && !gone[order.id]) {
          gone[order.id] = true
          selectedOrders.push(assign({}, order))
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
        <table className={`${style.table} mdl-data-table mdl-data-table--selectable mdl-shadow--2dp`}>
          <thead>
            <tr>
              {!hasSelected && <th className='mdl-data-table__cell--non-numeric'>#</th>}
              <th className='mdl-data-table__cell--non-numeric'>Name</th>
              <th className='mdl-data-table__cell--non-numeric'>Start</th>
              <th className='mdl-data-table__cell--non-numeric'>End</th>
              <th className={hasSelected ? 'mdl-data-table__cell--non-numeric' : ''}>
                Investment
              </th>
            </tr>
          </thead>
          <tbody>
            {map(selectedOrders || sortBy(orders, 'start').reverse(),
              (order, index) => hasSelected
                ? <Editable key={index} {...order} index={index}/>
                : <Clonable key={order.id} {...order}/>)}
          </tbody>
        </table>
      </form>
    )
  }
})

export default contextualize(OrdersClone, 'folder')
