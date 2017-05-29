import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import Input from '../../../Input'
import map from 'lodash/map'

const txtInputs = [
  'sitelinkLine2',
  'sitelinkLine3',
  'sitelinkText',
  'sitelinkFinalUrl'
]

class NewSiteLink extends React.Component {
  static displayName = 'New-Site-Link'

  static propTypes = {
    folder: PropTypes.object,
    cancel: PropTypes.func,
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    campaign: PropTypes.object
  }

  save = () => {

  }

  state = {
    sitelinkLine2: '',
    sitelinkLine3: '',
    sitelinkText: '',
    sitelinkFinalUrl: ''
  }

  onChangeText = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  input = name => {
    const props = {
      name,
      label: name,
      onChange: this.onChangeText
    }

    return (
      <Input key={name} {...props}/>
    )
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          {map(txtInputs, this.input)}
        </div>

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(NewSiteLink, style)
