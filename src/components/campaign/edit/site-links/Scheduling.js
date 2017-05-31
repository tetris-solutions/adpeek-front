import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import Select from '../../../Select'
import map from 'lodash/map'
import {Button} from '../../../Button'
import {style} from '../style'

const Option = ({value, children}) => (
  <Message tag='option' value={value}>
    {children}
  </Message>
)

Option.displayName = 'Option'
Option.propTypes = {
  value: PropTypes.any,
  children: PropTypes.string
}

const hours = []
for (let i = 0; i < 24; i++) {
  hours.push(i)
}

const Hour = ({name, value, onChange}) => (
  <Select name={name} value={value} onChange={onChange}>{map(hours, h =>
    <option value={h}>
      {h < 10
        ? '0' + h
        : String(h)}
    </option>)}
  </Select>
)

Hour.displayName = 'Hour'
Hour.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

const Minute = ({name, value, onChange}) => (
  <Select name={name} value={value} onChange={onChange}>
    <option value='ZERO'>00</option>
    <option value='FIFTEEN'>15</option>
    <option value='THIRTY'>30</option>
    <option value='FORTY_FIVE'>45</option>
  </Select>
)

Minute.displayName = 'Minute'
Minute.propTypes = {
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
    startHour: PropTypes.number.isRequired,
    startMinute: PropTypes.number.isRequired,
    endHour: PropTypes.number.isRequired,
    endMinute: PropTypes.number.isRequired
  }

  static contextTypes = {
    moment: PropTypes.func.isRequired
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

    const {moment} = this.context

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--4-col'>
          <Select name={`scheduling.${i}.dayOfWeek`} value={dayOfWeek} onChange={onChange}>
            <Option value='ALL_WEEK'>
              allWeek
            </Option>
            <Option value='WEEK_DAYS'>
              weekDays
            </Option>
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
            name={`scheduling.${i}.startHour`}
            value={startHour}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Minute
            name={`scheduling.${i}.startMinute`}
            value={startMinute}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Hour
            name={`scheduling.${i}.endHour`}
            value={endHour}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Minute
            name={`scheduling.${i}.endMinute`}
            value={endMinute}
            onChange={onChange}/>
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
    addSchedule: PropTypes.array
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
