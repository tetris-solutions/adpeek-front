import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Fence from '../../Fence'
import Network, {networkNames} from './Network'
import BiddingStrategy from './BiddingStrategy'
import OptimizationStatus from './OptimizationStatus'
import {isLocation, parseProximity} from '../edit/geo-location/GeoLocation'
import assign from 'lodash/assign'
import map from 'lodash/map'
import head from 'lodash/head'
import pick from 'lodash/pick'
import filter from 'lodash/filter'
import flatten from 'lodash/flatten'
import toLower from 'lodash/toLower'
import lowerFirst from 'lodash/lowerFirst'
import ProximityDescription from '../edit/geo-location/ProximityDescription'
import {
  list,
  isLanguage,
  isPlatform,
  isUserList,
  everyCriteria,
  Wrapper,
  SubText,
  None,
  Info,
  Section,
  SectionTitle
} from '../Utils'

const mapExtensions = (ls, type, cb) => map(flatten(map(filter(ls, {type}), 'extensions')), cb)

const urlFor = ({company, workspace, folder, campaign}, fragment = null) => {
  const campaignUrl = `/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${campaign}`

  return fragment
    ? `${campaignUrl}/edit/${fragment}`
    : campaignUrl
}

const EveryLanguage = everyCriteria('language')
const EveryLocation = everyCriteria('location')

function AdwordsCampaign (props, context) {
  const {reload, children, params, campaign: {status: {status}, details, name}} = props
  const {messages, router} = context

  function closeModal (reloadFirst = true) {
    const navigate = () => router.push(urlFor(params))

    if (reloadFirst) {
      return reload().then(navigate)
    }

    return navigate()
  }

  const cancel = () => closeModal(false)

  return (
    <Fence canEditCampaign>{({canEditCampaign: editable}) =>
      <Wrapper>
        <Info editLink={editable ? urlFor(params, 'name') : null}>
          <Message>nameLabel</Message>:
          <SubText>{name}</SubText>
        </Info>

        <Info editLink={editable ? urlFor(params, 'status') : null}>
          <Message>campaignStatusLabel</Message>:
          <SubText>{status}</SubText>
        </Info>

        <Info editLink={editable ? urlFor(params, 'network') : null}>
          <Message>targetNetworks</Message>:
          {list(pick(details, networkNames),
            (active, key) => active
              ? <Network key={key} name={key}/>
              : null)}
        </Info>

        <Info editLink={editable ? urlFor(params, 'geo-location') : null}>
          <Message>targetLocation</Message>:
          {list(filter(details.criteria, isLocation), loc =>
            <SubText key={loc.id}>{loc.location
              ? `${loc.location} (${loc.location_type})`
              : <ProximityDescription {...parseProximity(loc)}/>}
            </SubText>, EveryLocation)}
        </Info>

        <Info editLink={editable ? urlFor(params, 'language') : null}>
          <Message>targetLanguage</Message>:
          {list(filter(details.criteria, isLanguage), ({id, language}) =>
            <SubText key={id}>{language}</SubText>, EveryLanguage)}
        </Info>

        <Info>
          <Message>conversionTracker</Message>:
          {list(details.conversionTracker, ({id, name}) =>
            <SubText key={id}>{name}</SubText>)}
        </Info>

        <SectionTitle>
          <Message>extensions</Message>:
        </SectionTitle>

        <Section>
          <Info editLink={editable ? urlFor(params, 'site-links') : null}>
            <Message>siteLinks</Message>:
            {list(mapExtensions(details.extension, 'SITELINK',
              ({sitelinkText, sitelinkFinalUrls: {urls}}, index) =>
                <SubText key={index}>
                  <a className='mdl-color-text--blue-grey-500' href={head(urls)} target='_blank'>
                    {sitelinkText}
                  </a>
                </SubText>))}
          </Info>

          <Info editLink={editable ? urlFor(params, 'call-outs') : null}>
            <Message>callOut</Message>:
            {list(mapExtensions(details.extension, 'CALLOUT',
              ({calloutText}, index) =>
                <SubText key={index}>
                  "{calloutText}"
                </SubText>))}
          </Info>

          <Info editLink={editable ? urlFor(params, 'locations') : null}>
            <Message>feedLocal</Message>:
            {list(details.locationFeeds, ({id, name}) =>
              <SubText key={id}>{name}</SubText>)}
          </Info>

          <Info editLink={editable ? urlFor(params, 'apps') : null}>
            <Message>targetApp</Message>:
            {list(mapExtensions(details.extension, 'APP',
              ({appLinkText, appFinalUrls: {urls}}, index) =>
                <SubText key={index}>
                  <a className='mdl-color-text--blue-grey-500' href={head(urls)} target='_blank'>
                    {appLinkText}
                  </a>
                </SubText>))}
          </Info>
        </Section>

        <Info>
          <Message>targetAudience</Message>:
          {list(filter(details.criteria, isUserList),
            ({user_list_id: id, user_list_name: name}) =>
              <SubText key={id}>{name}</SubText>)}
        </Info>

        <Info editLink={editable ? urlFor(params, 'bid-strategy') : null}>
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

        <Info editLink={editable ? urlFor(params, 'optimization-status') : null}>
          <Message>optimizationStatus</Message>:
          <OptimizationStatus status={details.optimization_status}/>
        </Info>

        <Info editLink={editable ? urlFor(params, 'delivery-method') : null}>
          <Message>deliveryMethodLabel</Message>:
          <SubText>
            {messages[toLower(details.delivery_method) + 'Delivery']}
          </SubText>
        </Info>

        <Info editLink={editable ? urlFor(params, 'platform') : null}>
          <Message>platformCriteria</Message>:
          {list(filter(details.criteria, isPlatform), ({id, platform}) =>
            <SubText key={id}>
              <Message>{lowerFirst(platform) + 'Device'}</Message>
            </SubText>)}
        </Info>

        <Info editLink={editable ? urlFor(params, 'dynamic-search-ads') : null}>
          <Message>dynamicSearchAdSettings</Message>
          {list(filter(details.settings, {SettingType: 'DynamicSearchAdsSetting'}),
            ({domainName}, index) =>
              <SubText key={index}>
                {domainName}
              </SubText>)}
        </Info>

        {children
          ? React.cloneElement(children, assign({}, props, {cancel, onSubmit: closeModal}))
          : null}
      </Wrapper>}
    </Fence>
  )
}

AdwordsCampaign.displayName = 'Adwords-Campaign'
AdwordsCampaign.propTypes = {
  children: PropTypes.node,
  reload: PropTypes.func,
  params: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

AdwordsCampaign.contextTypes = {
  messages: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object
}

export default AdwordsCampaign
