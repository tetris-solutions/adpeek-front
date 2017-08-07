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
  style,
  Wrapper,
  SubText,
  list,
  isPlatform,
  isUserList,
  mapExtensions
} from '../campaign/Utils'
import {EditLink} from './EditableCreative'

const modalComponent = {
  platform: injectAdGroup(Platform),
  'user-lists': injectAdGroup(UserLists),
  'call-outs': injectAdGroup(CallOut),
  'site-links': injectAdGroup(SiteLinks)
}

const Info = ({extension, children}) => (
  <h6 className={style.title}>
    {children}
    <EditLink name='extension' value={extension} className={style.edit}>
      <Message>edit</Message>
    </EditLink>
  </h6>
)
Info.displayName = 'Info'
Info.propTypes = {
  extension: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

class AdGroupDetails extends React.PureComponent {
  static displayName = 'AdGroup-Details'
  static propTypes = {
    criteria: PropTypes.array,
    extensions: PropTypes.array,
    reload: PropTypes.func
  }

  static contextTypes = {
    getQueryParam: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  save = () => {
    return this.props.reload()
      .then(() => this.context.closeModal('extension'))
  }

  render () {
    const {getQueryParam, closeModal} = this.context
    const Modal = modalComponent[getQueryParam('extension')]
    const {extensions, criteria} = this.props

    return (
      <Wrapper>
        <Info extension='platform'>
          <Message>platformCriteria</Message>:
          {list(filter(criteria, isPlatform), ({platform}) =>
            <SubText key={platform}>
              <Message>{lowerFirst(platform) + 'Device'}</Message>
            </SubText>)}
        </Info>

        <Info extension='user-lists'>
          <Message>targetAudience</Message>:
          {list(filter(criteria, isUserList),
            ({user_list_id: id, user_list_name: name}) =>
              <SubText key={id}>{name}</SubText>)}
        </Info>

        <Info extension='site-links'>
          <Message>siteLinks</Message>:
          {list(mapExtensions(extensions, 'SITELINK',
            ({sitelinkText, sitelinkFinalUrls: {urls}}, index) =>
              <SubText key={index}>
                <a className='mdl-color-text--blue-grey-500' href={head(urls)} target='_blank'>
                  {sitelinkText}
                </a>
              </SubText>))}
        </Info>

        <Info extension='call-outs'>
          <Message>callOut</Message>:
          {list(mapExtensions(extensions, 'CALLOUT',
            ({calloutText}, index) =>
              <SubText key={index}>
                "{calloutText}"
              </SubText>))}
        </Info>

        {Modal && (
          <Modal
            {...this.props}
            onSubmit={this.save}
            cancel={() => closeModal('extension')}/>)}
      </Wrapper>
    )
  }
}

export default node('workspace', 'folder', AdGroupDetails)
