import React from 'react'
import Switch from './Switch'
import Input from './Input'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import moment from 'moment'
import VerticalAlign from './VerticalAlign'
import Message from '@tetris/front-server/lib/components/intl/Message'

// const {PropTypes} = React
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
  },
  onChangeDate ({target: {value, name}}) {
    this.setState({[name]: value})
  },
  onChangeAutoBudget ({target: {checked}}) {
    this.setState({autoBudget: checked})
  },
  render () {
    const {start, end, autoBudget} = this.state

    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div className={`mdl-card__supporting-text ${style.inner}`}>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--1-offset mdl-cell--3-col'>
              <Input
                type='date'
                value={start}
                label='startDate'
                onChange={this.onChangeValue}
                name='start'/>
            </div>
            <div className='mdl-cell mdl-cell--3-col'>
              <Input
                value={end}
                type='date'
                label='endDate'
                onChange={this.onChangeValue}
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
