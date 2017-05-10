import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Fence from '../../Fence'
import Modal from 'tetris-iso/Modal'
import {Wrapper, SubText, None, Info, Section, SectionTitle} from '../Utils'
import Network, {networkNames} from './Network'
import BiddingStrategy from './BiddingStrategy'
import OptimizationStatus from './OptimizationStatus'
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
const isUserList = {type: 'USER_LIST'}
const isApplication = {type: 'MOBILE_APPLICATION'}

const mapExtensions = (ls, type, cb) => map(flatten(map(filter(ls, {type}), 'extensions')), cb)

const crop = ls => ls.length > 10 ? ls.slice(0, 10)
  .concat([
    <SubText key={Math.random().toString(36).substr(2)}>
      ...
    </SubText>
  ]) : ls

const urlFor = ({company, workspace, folder, campaign}, fragment = null) => {
  const campaignUrl = `/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${campaign}`

  return fragment
    ? `${campaignUrl}/edit/${fragment}`
    : campaignUrl
}

const AdwordsCampaign = ({editable, children, params, campaign: {details, name}}, {messages, router}) =>
  <Wrapper>
    <Info editLink={editable ? urlFor(params, 'name') : null}>
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

    <SectionTitle>
      <Message>extensions</Message>:
    </SectionTitle>

    <Section>
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
    </Section>

    <Info>
      <Message>targetAudience</Message>:

      {maybeList(crop(map(filter(details.criterion, isUserList), ({user_list_id: id, user_list_name: name}) =>
        <SubText key={id}>{name}</SubText>)))}
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

    {children
      ? <Modal onEscPress={() => router.push(urlFor(params))}>{children}</Modal>
      : null}
  </Wrapper>

AdwordsCampaign.displayName = 'Adwords-Campaign'
AdwordsCampaign.propTypes = {
  editable: PropTypes.bool,
  children: PropTypes.node,
  params: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}
AdwordsCampaign.contextTypes = {
  messages: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object
}

const CWrap = props =>
  <Fence canEditCampaign>{({canEditCampaign}) =>
    <AdwordsCampaign {...props} editable={canEditCampaign}>
      {props.children
        ? React.cloneElement(props.children, props)
        : null}
    </AdwordsCampaign>}
  </Fence>

CWrap.displayName = 'enhance(Adwords-Campaign)'
CWrap.propTypes = {
  children: PropTypes.node
}

export default CWrap
