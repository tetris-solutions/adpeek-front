import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Card, Content, Header} from '../Card'
import csjs from 'csjs'
import {styledFunctionalComponent} from '../higher-order/styled'
import map from 'lodash/map'
import head from 'lodash/head'
import pick from 'lodash/pick'
import keys from 'lodash/keys'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import camelCase from 'lodash/camelCase'
import toLower from 'lodash/toLower'
import isArray from 'lodash/isArray'
import PrettyNumber from '../PrettyNumber'

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
  overflow: hidden;
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
const Italic = props => <em {...props} className={`${style.subText}`}/>

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

const None = () =>
  <SubText>
    <Message>targetNotSetForCampaign</Message>
  </SubText>

None.displayName = 'None'

function maybeList (ls) {
  ls = isArray(ls) ? compact(ls) : [ls]

  if (isEmpty(ls)) {
    return <None/>
  }

  return ls
}

const isLocation = {type: 'LOCATION'}
const isLanguage = {type: 'LANGUAGE'}
const isApplication = {type: 'MOBILE_APPLICATION'}

const mapExtensions = (ls, type, cb) => map(flatten(map(filter(ls, {type}), 'extensions')), cb)

const crop = ls => ls.length > 10 ? ls.slice(0, 10)
  .concat([
    <SubText key={Math.random().toString(36).substr(2)}>
      ...
    </SubText>
  ]) : ls

function BiddingStrategy ({type, name, cpa, roas}, {messages}) {
  let label

  if (name) {
    label = <span>{name}</span>
  } else {
    const labelName = camelCase(type) + 'Label'
    label = messages[labelName] || type
  }

  return (
    <span>
      <SubText>{label}</SubText>

      {cpa ? (
        <Italic>
          {'(CPA: '}
          <PrettyNumber type='currency'>{cpa}</PrettyNumber>
          {')'}
        </Italic>
      ) : null}

      {roas ? (
        <Italic>
          {'(ROAS: '}
          <PrettyNumber type='currency'>{roas}</PrettyNumber>
          {')'}
        </Italic>
      ) : null}
    </span>
  )
}

BiddingStrategy.displayName = 'Bidding-Strategy'
BiddingStrategy.propTypes = {
  amount: PropTypes.number,
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  cpa: PropTypes.number,
  roas: PropTypes.number
}
BiddingStrategy.contextTypes = {
  messages: PropTypes.object.isRequired
}

function OptimizationStatus ({status}, {messages}) {
  const labelName = camelCase(status) + 'StatusLabel'

  return (
    <SubText>
      {messages[labelName] ? messages[labelName] : status}
    </SubText>
  )
}

OptimizationStatus.displayName = 'Optimization-Status'
OptimizationStatus.propTypes = {
  status: PropTypes.oneOf([
    'OPTIMIZE',
    'CONVERSION_OPTIMIZE',
    'ROTATE',
    'ROTATE_INDEFINITELY',
    'UNAVAILABLE',
    'UNKNOWN'
  ])
}
OptimizationStatus.contextTypes = BiddingStrategy.contextTypes

const AdwordsCampaign = ({campaign: {details, name}}) => (
  <Card size='large'>
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
        {maybeList(map(pick(details, networkNames),
          (active, key) => active
            ? <Network key={key} name={key}/>
            : null))}
      </Info>

      <Info>
        <Message>targetLocation</Message>:
        {maybeList(crop(map(filter(details.criterion, isLocation),
          ({id, location, location_type}) =>
            <SubText key={id}>
              {location} ({location_type})
            </SubText>)))}
      </Info>

      <Info>
        <Message>targetLanguage</Message>:
        {maybeList(crop(map(filter(details.criterion, isLanguage),
          ({id, language}) =>
            <SubText key={id}>
              {language}
            </SubText>)))}
      </Info>

      <Info>
        <Message>conversionTracker</Message>:
        <None/>
      </Info>

      <h6 className={`${style.extTitle}`}>
        <em>
          <Message>extensions</Message>:
        </em>
      </h6>

      <div className={`${style.extensions}`}>
        <Info>
          <Message>siteLinks</Message>:
          {maybeList(mapExtensions(details.extension, 'SITELINK',
            ({sitelinkText, sitelinkFinalUrls: {urls}}, index) =>
              <SubText key={index}>
                <a href={head(urls)} target='_blank'>
                  {sitelinkText}
                </a>
              </SubText>))}
        </Info>

        <Info>
          <Message>callOut</Message>:
          {maybeList(mapExtensions(details.extension, 'CALLOUT',
            ({calloutText}, index) =>
              <SubText key={index}>
                "{calloutText}"
              </SubText>))}
        </Info>

        <Info>
          <Message>feedLocal</Message>:
          <None/>
        </Info>

        <Info>
          <Message>targetApp</Message>:
          {maybeList(crop(map(filter(details.criterion, isApplication),
            ({id, app_name}) =>
              <SubText key={id}>
                {app_name}
              </SubText>)))}
        </Info>
      </div>

      <Info>
        <Message>targetAudience</Message>:
        {maybeList([
          details.gender && <SubText key='gender'>{details.gender}</SubText>,
          details.age_range && <SubText key='age'>{details.age_range}</SubText>])}
      </Info>

      <Info>
        <Message>biddingConfiguration</Message>:
        {details.bidding_strategy_name || details.bidding_strategy_type ? (
          <BiddingStrategy
            amount={details.amount}
            id={details.bidding_strategy_id}
            cpa={details.cpa}
            roas={details.roas}
            type={details.bidding_strategy_type}
            name={details.bidding_strategy_name}/>) : null}
      </Info>

      <Info>
        <Message>optimizationStatus</Message>:
        <OptimizationStatus status={details.optimization_status}/>
      </Info>

      <Info>
        <Message>deliveryMethodLabel</Message>:
        {maybeList(details.delivery_method &&
          <SubText>
            <Message>
              {toLower(details.delivery_method) + 'Delivery'}
            </Message>
          </SubText>)}
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
