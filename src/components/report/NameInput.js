import React from 'react'
import PropTypes from 'prop-types'
import {updateReportAction} from '../../actions/update-report'
import Input from '../Input'
import debounce from 'lodash/debounce'

const tStyle = {width: '100%', padding: 0}

class NameInput extends React.Component {
  static displayName = 'Report-Name-Input'

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    report: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string
    }).isRequired
  }

  static contextTypes = {
    messages: PropTypes.object.isRequired
  }

  state = {
    name: this.props.report.name,
    description: this.props.report.description
  }

  componentDidMount () {
    this.save = debounce(() => {
      const {dispatch, params, report} = this.props

      dispatch(updateReportAction, params, {
        id: report.id,
        name: this.state.name,
        description: this.state.description
      })
    }, 1000)
  }

  onChange = ({target: {value, name}}) => {
    this.setState({[name]: value}, this.save)
  }

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
}

export default NameInput
