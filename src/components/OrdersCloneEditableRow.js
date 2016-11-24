import React from 'react'
import Checkbox from './Checkbox'
import Input from './Input'
import OrderDateRange from './OrderDateRange'

const {PropTypes} = React

export const Editable = React.createClass({
  displayName: 'Editable',
  propTypes: {
    index: PropTypes.number,
    name: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    auto_budget: PropTypes.bool,
    amount: PropTypes.number
  },
  contextTypes: {
    moment: PropTypes.func
  },
  getInitialState () {
    return {
      autoBudget: this.props.auto_budget,
      start: this.props.start,
      end: this.props.end
    }
  },
  componentDidMount () {
    this.refs.start.programaticallySetValue = start => this.setState({start})
    this.refs.end.programaticallySetValue = end => this.setState({end})
  },
  componentWillReceiveProps ({start, end}) {
    if (start !== this.props.start || end !== this.props.end) {
      this.setState({start, end})
    }
  },
  onChangeAutoBudget ({target: {checked}}) {
    this.setState({autoBudget: checked})
  },
  onChangeRange ({startDate, endDate}) {
    this.setState({
      start: startDate.format('YYYY-MM-DD'),
      end: endDate.format('YYYY-MM-DD')
    })
  },
  render () {
    const {index, name, amount} = this.props
    const {start, end} = this.state
    const {moment} = this.context

    return (
      <tr>
        <td className='mdl-data-table__cell--non-numeric'>
          <Checkbox checked name={`${index}.selected`}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Input name={`${index}.name`} defaultValue={name}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <OrderDateRange
            buttonClassName='mdl-button'
            onChange={this.onChangeRange}
            startDate={moment(start)}
            endDate={moment(end)}/>

          <input type='hidden' name={`${index}.start`} value={start} ref='start'/>
          <input type='hidden' name={`${index}.end`} value={end} ref='end'/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Input currency type='number' name={`${index}.amount`} defaultValue={amount}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Checkbox
            checked={this.state.autoBudget}
            name={`${index}.autoBudget`}/>
        </td>
      </tr>
    )
  }
})

export default Editable
