import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import lowerFirst from 'lodash/lowerFirst'
import filter from 'lodash/filter'
import Platform from '../adwords-setup/platform/Modal'
import {injectAdGroup} from './inject-adgroup'
import {Wrapper, Info, SubText, list, isPlatform} from '../campaign/Utils'

const modalComponent = {
  platform: injectAdGroup(Platform)
}

class AdGroupDetails extends React.PureComponent {
  static displayName = 'AdGroup-Details'
  static propTypes = {
    criteria: PropTypes.array,
    reload: PropTypes.func
  }

  state = {
    openModal: null
  }

  setModal = modal => () => {
    this.setState({openModal: modal})
  }

  save = () => {
    return this.props.reload()
      .then(this.setModal(null))
  }

  render () {
    const Modal = modalComponent[this.state.openModal]
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

        {Modal && (
          <Modal
            {...this.props}
            onSubmit={this.save}
            cancel={this.setModal(null)}/>)}
      </Wrapper>
    )
  }
}

export default AdGroupDetails