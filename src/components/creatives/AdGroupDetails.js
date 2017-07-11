import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import lowerFirst from 'lodash/lowerFirst'
import filter from 'lodash/filter'
import Platform from '../adwords-setup/platform/Modal'
import UserLists from '../adwords-setup/user-lists/Modal'
import CallOut from '../adwords-setup/call-out/Modal'
import SiteLinks from '../adwords-setup/site-links/Modal'
import {injectAdGroup} from './inject-adgroup'
import {node} from '../higher-order/branch'
import head from 'lodash/head'
import {
  Wrapper,
  Info,
  SubText,
  list,
  isPlatform,
  isUserList,
  mapExtensions
} from '../campaign/Utils'

const modalComponent = {
  platform: injectAdGroup(Platform),
  'user-lists': injectAdGroup(UserLists),
  'call-outs': injectAdGroup(CallOut),
  'site-links': injectAdGroup(SiteLinks)
}

class AdGroupDetails extends React.PureComponent {
  static displayName = 'AdGroup-Details'
  static propTypes = {
    criteria: PropTypes.array,
    extension: PropTypes.array,
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
    const {extension, criteria} = this.props

    return (
      <Wrapper>
        <Info editClick={this.setModal('platform')}>
          <Message>platformCriteria</Message>:
          {list(filter(criteria, isPlatform), ({platform}) =>
            <SubText key={platform}>
              <Message>{lowerFirst(platform) + 'Device'}</Message>
            </SubText>)}
        </Info>

        <Info editClick={this.setModal('user-lists')}>
          <Message>targetAudience</Message>:
          {list(filter(criteria, isUserList),
            ({user_list_id: id, user_list_name: name}) =>
              <SubText key={id}>{name}</SubText>)}
        </Info>

        <Info editClick={this.setModal('site-links')}>
          <Message>siteLinks</Message>:
          {list(mapExtensions(extension, 'SITELINK',
            ({sitelinkText, sitelinkFinalUrls: {urls}}, index) =>
              <SubText key={index}>
                <a className='mdl-color-text--blue-grey-500' href={head(urls)} target='_blank'>
                  {sitelinkText}
                </a>
              </SubText>))}
        </Info>

        <Info editClick={this.setModal('call-outs')}>
          <Message>callOut</Message>:
          {list(mapExtensions(extension, 'CALLOUT',
            ({calloutText}, index) =>
              <SubText key={index}>
                "{calloutText}"
              </SubText>))}
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

export default node('workspace', 'folder', AdGroupDetails)
