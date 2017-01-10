import React from 'react'
import {updateReportAction} from '../../actions/update-report'
import Input from '../Input'
import debounce from 'lodash/debounce'

const tStyle = {width: '100%', padding: 0}

const NameInput = React.createClass({
  displayName: 'Report-Name-Input',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    report: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      description: React.PropTypes.string
    }).isRequired
  },
  contextTypes: {
    messages: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      name: this.props.report.name,
      description: this.props.report.description
    }
  },
  componentDidMount () {
    this.save = debounce(() => {
      const {dispatch, params, report} = this.props

      dispatch(updateReportAction, params, {
        id: report.id,
        name: this.state.name,
        description: this.state.description
      })
    }, 1000)
  },
  onChange ({target: {value, name}}) {
    this.setState({[name]: value}, this.save)
  },
  render () {
    const {name, description} = this.state
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell--12-col'>
          <Input
            name='name'
            value={name}
            onChange={this.onChange}/>
        </div>
        <div className='mdl-cell--12-col'>
          <div className='mdl-textfield' style={tStyle}>
            <textarea
              placeholder={this.context.messages.reportDescriptionPlaceholder}
              value={description || ''}
              onChange={this.onChange}
              className='mdl-textfield__input'
              rows={3}
              name='description'/>
          </div>
        </div>
      </div>
    )
  }
})

export default NameInput
