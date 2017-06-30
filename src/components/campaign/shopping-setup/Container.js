import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Page from '../../Page'
import SubHeader from '../../SubHeader'
import {Card, Content} from '../../Card'

class ShoppingSetupContainer extends React.PureComponent {
  static displayName = 'Shopping-Setup-Container'

  static propTypes = {
    folder: PropTypes.object,
    campaign: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  render () {
    return (
      <div>
        <SubHeader title={<Message>shoppingSetupTitle</Message>}/>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <Card size='full'>
                <Content/>
              </Card>
            </div>
          </div>
        </Page>
      </div>
    )
  }
}

export default ShoppingSetupContainer
