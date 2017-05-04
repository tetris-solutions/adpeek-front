import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Card, Content, Header} from '../Card'
import csjs from 'csjs'
import {styledFunctionalComponent} from '../higher-order/styled'
import map from 'lodash/map'
import pick from 'lodash/pick'
import keys from 'lodash/keys'
import filter from 'lodash/filter'

const style = csjs`
.edit {
  margin-left: 1em;
  font-size: x-small;
  cursor: pointer;
  text-transform: lowercase;
}
.subText {
  font-size: .6em;
  font-weight: 400;
  margin-left: 1em;
}
.title {
  margin: .3em 0;
}`

const EditLink = ({onClick}) =>
  <a className={`${style.edit}`} onClick={onClick}>
    <Message>edit</Message>
  </a>

EditLink.displayName = 'Edit-Link'
EditLink.propTypes = {
  onClick: PropTypes.func
}

const networkMessages = {
  google_search: 'googleSearchNetwork',
  search_network: 'searchNetwork',
  content_network: 'contentNetwork',
  partner_network: 'partnerNetwork'
}

const networkNames = keys(networkMessages)

const Network = ({name}) => (
  <span className={`${style.subText}`}>
    <Message>{networkMessages[name]}</Message>
  </span>
)
Network.displayName = 'Network'
Network.propTypes = {
  name: PropTypes.string
}

const Info = ({children, edit}) => (
  <h6 className={`${style.title}`}>
    {children}
    <EditLink onClick={edit}/>
  </h6>
)
Info.displayName = 'Info'
Info.propTypes = {
  children: PropTypes.node,
  edit: PropTypes.func
}

const isLocation = {type: 'LOCATION'}

const AdwordsCampaign = ({campaign: {details, name}}) => (
  <Card>
    <Header>
      <Message>campaignDetailsTitle</Message>
    </Header>
    <Content>
      <Info>
        <Message>nameLabel</Message>:
        <span className={`${style.subText}`}>{name}</span>
      </Info>

      <Info>
        <Message>targetNetworks</Message>:

        {map(pick(details, networkNames),
          (active, key) =>
            active ? <Network key={key} name={key}/> : null)}
      </Info>

      <Info>
        <Message>locationCriterion</Message>:

        {map(filter(details.criterion, isLocation), ({id, location, location_type}) =>
          <span key={id} className={`${style.subText}`}>{location} ({location_type})</span>)}
      </Info>
    </Content>
  </Card>
)

AdwordsCampaign.displayName = 'Adwords-Campaign'
AdwordsCampaign.propTypes = {
  params: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default styledFunctionalComponent(AdwordsCampaign, style)
