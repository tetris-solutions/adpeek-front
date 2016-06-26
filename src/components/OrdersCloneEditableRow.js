import React from 'react'
import Checkbox from './Checkbox'
import Input from './Input'

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
  getInitialState () {
    return {
      autoBudget: this.props.auto_budget
    }
  },
  onChangeAutoBudget ({target: {checked}}) {
    this.setState({autoBudget: checked})
  },
  render () {
    const {index, name, start, end, amount} = this.props

    return (
      <tr>
        <td className='mdl-data-table__cell--non-numeric'>
          <Checkbox checked name={`${index}.selected`}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Input name={`${index}.name`} defaultValue={name}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Input type='date' name={`${index}.start`} defaultValue={start}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Input type='date' name={`${index}.end`} defaultValue={end}/>
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          <Input type='number' name={`${index}.amount`} defaultValue={amount}/>
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
