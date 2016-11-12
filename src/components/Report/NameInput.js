import React from 'react'
import {updateReportAction} from '../../actions/update-report'
import Input from '../Input'
import debounce from 'lodash/debounce'

const NameInput = React.createClass({
  displayName: 'Report-Name-Input',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    report: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    }).isRequired
  },
  getInitialState () {
    return {
      name: this.props.report.name
    }
  },
  componentDidMount () {
    this.save = debounce(() => {
      const {dispatch, params, report} = this.props

      dispatch(updateReportAction, params, {
        id: report.id,
        name: this.state.name
      })
    }, 1000)
  },
  onChange ({target: {value: name}}) {
    this.setState({name}, this.save)
  },
  render () {
    const {name} = this.state
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell--12-col'>
          <Input
            name='name'
            value={name}
            onChange={this.onChange}/>
        </div>
      </div>
    )
  }
})

export default NameInput
