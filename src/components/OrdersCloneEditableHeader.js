import React from 'react'
import Switch from './Switch'
import Input from './Input'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import moment from 'moment'
import VerticalAlign from './VerticalAlign'
import filter from 'lodash/filter'
import find from 'lodash/find'
import endsWith from 'lodash/endsWith'
import Message from '@tetris/front-server/lib/components/intl/Message'

const style = csjs`
.card {
  width: 100%;
  margin: 1em 0;
  min-height: 0
}
.inner {
  width: 100%;
  margin: .3em 0;
  padding: 0
}`

/**
 * sets value in row
 * @param {String} name input name pattern
 * @param {String|Boolean} value value to replicate
 * @param {HTMLTableRowElement} tr table row
 * @return {undefined}
 */
function setValue (name, value, tr) {
  const input = find(tr.querySelectorAll('input'),
    input => endsWith(input.name, `.${name}`))

  if (!input) return

  if (input.type === 'checkbox') {
    if (value) {
      input.programaticallyCheck()
    } else {
      input.programaticallyUncheck()
    }
  } else {
    input.value = value
  }
}

/**
 * returns selected rows only
 * @param {HTMLFormElement} form DOM element
 * @param {String} name input name pattern
 * @param {String|Boolean} value value to replicate
 * @return {Array.<HTMLTableRowElement>} the list of <tr>'s
 */
function replicateValue (form, name, value) {
  filter(form.elements, input => (
    input &&
    input.type === 'checkbox' &&
    input.checked &&
    endsWith(input.name, '.selected')
  ))
    .map(input => input.parentNode.parentNode.parentNode)
    .forEach(setValue.bind(null, name, value))
}

export const EditableHeader = React.createClass({
  displayName: 'Editable-Header',
  mixins: [styled(style)],
  getInitialState () {
    return {
      start: moment().date(1).format('YYYY-MM-DD'),
      end: moment().add(1, 'month').date(0).format('YYYY-MM-DD'),
      autoBudget: true
    }
  },
  apply (e) {
    e.preventDefault()
    const {wrapper} = this.refs

    const autoBudgetInput = wrapper.querySelector('[name=autoBudget]')
    const startInput = wrapper.querySelector('[name=start]')
    const endInput = wrapper.querySelector('[name=end]')

    replicateValue(autoBudgetInput.form, 'autoBudget', autoBudgetInput.checked)
    replicateValue(startInput.form, 'start', startInput.value)
    replicateValue(endInput.form, 'end', endInput.value)
  },
  onChangeDate ({target: {value, name, form}}) {
    this.setState({[name]: value})
    replicateValue(form, name, value)
  },
  onChangeAutoBudget ({target: {checked, form}}) {
    this.setState({autoBudget: checked})
    replicateValue(form, 'autoBudget', checked)
  },
  render () {
    const {start, end, autoBudget} = this.state

    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`} ref='wrapper'>
        <div className={`mdl-card__supporting-text ${style.inner}`}>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--1-offset mdl-cell--3-col'>
              <Input
                type='date'
                value={start}
                label='startDate'
                onChange={this.onChangeDate}
                name='start'/>
            </div>
            <div className='mdl-cell mdl-cell--3-col'>
              <Input
                value={end}
                type='date'
                label='endDate'
                onChange={this.onChangeDate}
                name='end'/>
            </div>
            <VerticalAlign className='mdl-cell mdl-cell--1-offset  mdl-cell--2-col'>
              <div>
                <Switch
                  onChange={this.onChangeAutoBudget}
                  checked={autoBudget}
                  name='autoBudget'
                  label='Auto Budget'/>
              </div>
            </VerticalAlign>
            <VerticalAlign className='mdl-cell mdl-cell--2-col'>
              <div>
                <button className='mdl-button' onClick={this.apply}>
                  <Message>applyToSelectedOrders</Message>
                </button>
              </div>
            </VerticalAlign>
          </div>
        </div>
      </div>
    )
  }
})

export default EditableHeader
