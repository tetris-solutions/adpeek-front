import React from 'react'
import Message from '@tetris/front-server/Message'
import PropTypes from 'prop-types'
import Select from '../../../Select'
import map from 'lodash/map'
import {Button} from '../../../Button'
import {style} from '../style'

const hours = []
for (let i = 0; i < 24; i++) {
  hours.push(i)
}

const Hour = ({label, name, value, onChange}) => (
  <Select label={label} name={name} value={value} onChange={onChange}>
    {map(hours, h =>
      <option key={h} value={h}>
        {h < 10
          ? '0' + h
          : String(h)}
      </option>)}
  </Select>
)

Hour.displayName = 'Hour'
Hour.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

const Minute = ({label, name, value, onChange}) => (
  <Select name={name} value={value} onChange={onChange} label={label}>
    <option value='ZERO'>00</option>
    <option value='FIFTEEN'>15</option>
    <option value='THIRTY'>30</option>
    <option value='FORTY_FIVE'>45</option>
  </Select>
)

Minute.displayName = 'Minute'
Minute.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

class Schedule extends React.PureComponent {
  static displayName = 'Schedule'

  static propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    dayOfWeek: PropTypes.string.isRequired,
    startHour: PropTypes.string.isRequired,
    startMinute: PropTypes.string.isRequired,
    endHour: PropTypes.string.isRequired,
    endMinute: PropTypes.string.isRequired,
    removeSchedule: PropTypes.func.isRequired
  }

  static contextTypes = {
    moment: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired
  }

  remove = e => {
    e.preventDefault()

    this.props.removeSchedule(this.props.index)
  }

  render () {
    const {
      index: i,
      dayOfWeek,
      startHour,
      startMinute,
      endHour,
      endMinute,
      onChange
    } = this.props

    const {moment, messages} = this.context

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--3-col'>
          <Select name={`scheduling.${i}.dayOfWeek`} value={dayOfWeek} onChange={onChange} label='dayOfWeek'>
            <option value='ALL_WEEK'>
              {messages.allWeek}
            </option>
            <option value='WEEK_DAYS'>
              {messages.weekDays}
            </option>
            <option value='MONDAY'>
              {moment().day(1).format('dddd')}
            </option>
            <option value='TUESDAY'>
              {moment().day(2).format('dddd')}
            </option>
            <option value='WEDNESDAY'>
              {moment().day(3).format('dddd')}
            </option>
            <option value='THURSDAY'>
              {moment().day(4).format('dddd')}
            </option>
            <option value='FRIDAY'>
              {moment().day(5).format('dddd')}
            </option>
            <option value='SATURDAY'>
              {moment().day(6).format('dddd')}
            </option>
            <option value='SUNDAY'>
              {moment().day(0).format('dddd')}
            </option>
          </Select>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Hour
            label='startHour'
            name={`scheduling.${i}.startHour`}
            value={startHour}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Minute
            label='startMinute'
            name={`scheduling.${i}.startMinute`}
            value={startMinute}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Hour
            label='endHour'
            name={`scheduling.${i}.endHour`}
            value={endHour}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Minute
            label='endMinute'
            name={`scheduling.${i}.endMinute`}
            value={endMinute}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--1-col'>
          <br/>
          <a href='' onClick={this.remove}>
            <i className='material-icons'>close</i>
          </a>
        </div>
      </div>
    )
  }
}

class Scheduling extends React.Component {
  static displayName = 'Schedule-Interval'

  static propTypes = {
    schedules: PropTypes.array,
    onChange: PropTypes.func,
    removeSchedule: PropTypes.func,
    addSchedule: PropTypes.func
  }

  render () {
    return (
      <div>
        <div className={style.list}>
          {map(this.props.schedules, (schedule, index) =>
            <Schedule
              key={schedule.id}
              index={index}
              {...schedule}
              removeSchedule={this.props.removeSchedule}
              onChange={this.props.onChange}/>)}
        </div>

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col' style={{textAlign: 'right'}}>
            <Button className='mdl-button' onClick={this.props.addSchedule}>
              <Message>newSchedule</Message>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Scheduling
