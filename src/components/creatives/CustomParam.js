import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

class CustomParam extends React.PureComponent {
  static displayName = 'Custom-Param'
  static propTypes = {
    param: PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string
    }),
    onChange: PropTypes.func,
    drop: PropTypes.func
  }

  onClickRemove = () => {
    this.props.drop(this.props.param.id)
  }

  render () {
    const {param, onChange} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <Input
            name={`custom_params.${param.id}.key`}
            label='urlCustomParameterKey'
            value={param.key}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--5-col'>
          <Input
            name={`custom_params.${param.id}.value`}
            label='urlCustomParameterValue'
            value={param.value}
            onChange={onChange}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <br/>
          <a>
            <i className='material-icons' onClick={this.onClickRemove}>
              close
            </i>
          </a>
        </div>
      </div>
    )
  }
}

export default CustomParam
