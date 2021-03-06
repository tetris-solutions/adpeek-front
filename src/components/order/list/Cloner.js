import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import {Submit} from '../../Button'
import Message from '@tetris/front-server/Message'
import {branch} from '../../higher-order/branch'
import map from 'lodash/map'
import FormMixin from '../../mixins/FormMixin'
import {styledComponent} from '../../higher-order/styled'
import Checkbox from '../../Checkbox'
import csjs from 'csjs'
import find from 'lodash/find'
import assign from 'lodash/assign'
import sortBy from 'lodash/sortBy'
import EditableRow from './ClonerEditableRow'
import EditableHeader from './ClonerEditableHeader'
import MessageFormat from 'intl-messageformat'
import {cloneOrderAction} from '../../../actions/clone-order'
import {loadOrdersAction} from '../../../actions/load-orders'
import {pushSuccessMessageAction} from '../../../actions/push-success-message-action'
import SubHeader from '../../SubHeader'
import compact from 'lodash/compact'
import join from 'lodash/join'
import forEach from 'lodash/forEach'
import Page from '../../Page'

const style = csjs`
.table {
  width: 100%;
  margin: 2em 0 0
}`

const ClonableRow = ({name, id, start, end, amount}) => (
  <tr>
    <td className='mdl-data-table__cell--non-numeric'>
      <Checkbox name={id}/>
    </td>
    <td className='mdl-data-table__cell--non-numeric'>
      {name}
    </td>
    <td className='mdl-data-table__cell--non-numeric'>
      {start}<br/>
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

export const OrdersClone = createReactClass({
  displayName: 'Orders-Clone',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    orders: PropTypes.array
  },
  contextTypes: {
    locales: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    messages: PropTypes.shape({
      copyOfName: PropTypes.string
    }).isRequired
  },
  getInitialState () {
    return {
      selectedOrders: null
    }
  },
  componentWillMount () {
    const orderId = this.context.location.query.id
    if (!orderId) return

    const {orders} = this.props
    const order = find(orders, {id: orderId})

    if (!order) return

    this.setState({
      selectedOrders: [this.getCopyOf(order)]
    })
  },
  getCopyOf (order) {
    const {locales, messages: {copyOfName}} = this.context

    return assign({}, order, {
      id: null,
      clonedOrderId: order.id,
      name: new MessageFormat(copyOfName, locales).format({name: order.name})
    })
  },
  /**
   * @param {HTMLFormElement} form the form el
   * @return {undefined}
   */
  cloneOrders (form) {
    const {params, router} = this.context
    const {dispatch} = this.props
    const promises = map(this.state.selectedOrders,
      ({clonedOrderId, folder}, index) =>
        dispatch(cloneOrderAction, clonedOrderId, {
          folder: folder,
          name: form.elements[`${index}.name`].value,
          start: form.elements[`${index}.start`].value,
          end: form.elements[`${index}.end`].value,
          amount: form.elements[`${index}.amount`].inputMaskToNumber(),
          auto_budget: form.elements[`${index}.autoBudget`].checked
        }))

    function navigateBackToOrderList () {
      const scope = join(compact([
        `c/${params.company}`,
        params.workspace && `w/${params.workspace}`,
        params.folder && `f/${params.folder}`
      ]), '/')

      router.push(`/${scope}/orders`)
    }

    const reloadOrders = () =>
      dispatch(loadOrdersAction,
        params.company,
        params.workspace,
        params.folder)

    return Promise.all(promises)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(reloadOrders)
      .then(navigateBackToOrderList)
  },
  /**
   * @param {HTMLFormElement} form the form el
   * @return {undefined}
   */
  selectOrders (form) {
    const selectedOrders = []
    const gone = {}
    const {orders} = this.props

    forEach(form.elements, ({type, checked, name}) => {
      if (type !== 'checkbox' || !checked) return
      const order = find(orders, {id: name})

      if (order && !gone[order.id]) {
        gone[order.id] = true
        selectedOrders.push(this.getCopyOf(order))
      }
    })

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
        <SubHeader title={<Message>cloneOrders</Message>}>
          <Submit className='mdl-button mdl-color-text--grey-100'>
            {hasSelected
              ? <Message>save</Message>
              : <Message>selectOrders</Message>}
          </Submit>
        </SubHeader>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell--12-col' style={{overflowX: 'auto'}}>
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
                      {' / '}
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
        </Page>
      </form>
    )
  }
})

export default branch({}, styledComponent(OrdersClone, style))
