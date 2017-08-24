import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import DateRangePicker from '../DateRangePicker'
import {Button, Submit} from '../Button'
import Form from '../Form'

class DateRangeForm extends React.Component {
  static displayName = 'Date-Range-Form'

  static propTypes = {
    save: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired
  }

  state = {
    startDate: this.props.startDate,
    endDate: this.props.endDate
  }

  onChange = ({startDate, endDate}) => {
    this.setState({startDate, endDate})
  }

  save = () => {
    this.props.save(this.state)
    this.props.close()
  }

  render () {
    return (
      <Form onSubmit={this.save} className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h4>
            <Message>reportRangeTitle</Message>
          </h4>

          <DateRangePicker onChange={this.onChange} {...this.state}/>

          <br/>
          <hr/>

          <Button className='mdl-button' onClick={this.props.close}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--accent' style={{float: 'right'}}>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default DateRangeForm
