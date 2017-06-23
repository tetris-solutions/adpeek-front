import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import lowerFirst from 'lodash/lowerFirst'
import filter from 'lodash/filter'
import {Wrapper, Info, SubText, list, isPlatform} from '../campaign/Utils'

class AdGroupDetails extends React.Component {
  static displayName = 'AdGroup-Details'
  static propTypes = {
    criteria: PropTypes.array
  }

  state = {
    openModal: null
  }

  setModal = modal => () => {
    this.setState({openModal: modal})
  }

  render () {
    const {criteria} = this.props

    return (
      <Wrapper>
        <Info editClick={this.setModal('platform')}>
          <Message>platformCriteria</Message>:
          {list(filter(criteria, isPlatform), ({platform}) =>
            <SubText key={platform}>
              <Message>{lowerFirst(platform) + 'Device'}</Message>
            </SubText>)}
        </Info>
      </Wrapper>
    )
  }
}

export default AdGroupDetails
