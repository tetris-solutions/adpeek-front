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
import isEmpty from 'lodash/isEmpty'
import compact from 'lodash/compact'

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
}
.extensions {
  margin-left: 2em;
  margin-bottom: 1em;
}
.extTitle extends .title {
  margin-top: 1em;
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

const SubText = props => <span {...props} className={`${style.subText}`}/>

const Network = ({name}) => (
  <SubText>
    <Message>{networkMessages[name]}</Message>
  </SubText>
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

const Description = ({children}) => isEmpty(children) ? (
  <SubText>
    <Message>
      targetNotSetForCampaign
    </Message>
  </SubText>
) : <span>{children}</span>

Description.displayName = 'Description'
Description.propTypes = {
  children: PropTypes.node
}

const isLocation = {type: 'LOCATION'}
const isLanguage = {type: 'LANGUAGE'}
const isApplication = {type: 'MOBILE_APPLICATION'}

const AdwordsCampaign = ({campaign: {details, name}}) => (
  <Card>
    <Header>
      <Message>campaignDetailsTitle</Message>
    </Header>
    <Content>
      <Info>
        <Message>nameLabel</Message>:
        <SubText>{name}</SubText>
      </Info>

      <Info>
        <Message>targetNetworks</Message>:
        <Description>
          {compact(map(pick(details, networkNames),
            (active, key) => active
              ? <Network key={key} name={key}/>
              : null))}
        </Description>
      </Info>

      <Info>
        <Message>targetLocation</Message>:
        <Description>
          {map(filter(details.criterion, isLocation), ({id, location, location_type}) =>
            <SubText key={id}>
              {location} ({location_type})
            </SubText>)}
        </Description>
      </Info>

      <Info>
        <Message>targetLanguage</Message>:
        <Description>
          {map(filter(details.criterion, isLanguage), ({id, language}) =>
            <SubText key={id}>
              {language}
            </SubText>)}
        </Description>
      </Info>

      <Info>
        <Message>conversionTracker</Message>:
        <Description/>
      </Info>

      <h6 className={`${style.extTitle}`}>
        <em>
          <Message>extensions</Message>:
        </em>
      </h6>

      <div className={`${style.extensions}`}>
        <Info>
          <Message>siteLinks</Message>:
          <Description/>
        </Info>

        <Info>
          <Message>callOut</Message>:
          <Description/>
        </Info>

        <Info>
          <Message>feedLocal</Message>:
          <Description/>
        </Info>

        <Info>
          <Message>targetApp</Message>:

          <Description>
            {map(filter(details.criterion, isApplication), ({id, app_name}) =>
              <SubText key={id}>
                {app_name}
              </SubText>)}
          </Description>
        </Info>
      </div>

      <Info>
        <Message>deliveryMethodLabel</Message>:
        <SubText>{details.delivery_method}</SubText>
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
