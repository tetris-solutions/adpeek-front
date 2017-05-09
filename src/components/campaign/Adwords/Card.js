import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Card, Content, Header} from '../../Card'
import {style} from './style'
import {SubText, None, Info} from './Utils'
import Network, {networkNames} from './Network'
import BiddingStrategy from './BiddingStrategy'
import OptimizationStatus from './OptimizationStatus'
import {styledFunctionalComponent} from '../../higher-order/styled'
import map from 'lodash/map'
import head from 'lodash/head'
import pick from 'lodash/pick'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import toLower from 'lodash/toLower'
import isArray from 'lodash/isArray'

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

const AdwordsCampaign = ({campaign: {details, name}}, {messages}) => (
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
        {maybeList(crop(map(filter(details.criterion, isLanguage), ({id, language}) =>
          <SubText key={id}>{language}</SubText>)))}
      </Info>

      <Info>
        <Message>conversionTracker</Message>:
        {maybeList(crop(map(details.conversionTracker, ({id, name}) =>
          <SubText key={id}>{name}</SubText>)))}
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
          {maybeList(map(details.localFeed, ({id, name, data}) =>
            <SubText key={id}>
              {name} {data && data.emailAddress
              ? <em>(<Message email={data.emailAddress}>feedLocalBusiness</Message>)</em>
              : null}
            </SubText>))}
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
            name={details.bidding_strategy_name}/>) : <None/>}
      </Info>

      <Info>
        <Message>optimizationStatus</Message>:
        <OptimizationStatus status={details.optimization_status}/>
      </Info>

      <Info>
        <Message>deliveryMethodLabel</Message>:
        <SubText>
          {messages[toLower(details.delivery_method) + 'Delivery']}
        </SubText>
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
AdwordsCampaign.contextTypes = {
  messages: PropTypes.object
}

export default styledFunctionalComponent(AdwordsCampaign, style)
