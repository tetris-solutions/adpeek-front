import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../Form'
import {Submit} from '../../Button'

class ProductPartition extends React.Component {
  static displayName = 'Product-Partition'

  static propTypes = {
    folder: PropTypes.shape({
      productCategories: PropTypes.array.isRequired
    }),
    campaign: PropTypes.shape({
      adGroups: PropTypes.array
    }),
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {}

  save = () => {

  }

  render () {
    return (
      <Form onSubmit={this.save}>
        here goes partition tree
        <hr/>
        <div>
          <Submit className='mdl-button mdl-button-primary' style={{float: 'right'}}>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default ProductPartition
