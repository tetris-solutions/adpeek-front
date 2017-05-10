import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../Input'

class EditName extends React.Component {
  static displayName = 'Edit-Name'

  static propTypes = {
    campaign: PropTypes.object
  }

  state = {
    name: this.props.campaign.name
  }

  onChange = ({target}) => {
    this.setState({name: target.value})
  }

  render () {
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <Input
            onChange={this.onChange}
            value={this.state.name}
            name='name'
            label='name'/>
        </div>
      </div>
    )
  }
}

export default EditName
