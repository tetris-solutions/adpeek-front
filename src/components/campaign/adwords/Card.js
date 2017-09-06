import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Fence from '../../Fence'
import Network from './Network'
import BiddingStrategy from './BiddingStrategy'
import OptimizationStatus from './OptimizationStatus'
import {isLocation, parseProximity} from '../edit/geo-location/GeoLocation'
import assign from 'lodash/assign'
import map from 'lodash/map'
import head from 'lodash/head'
import filter from 'lodash/filter'
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
  SectionTitle,
  mapExtensions
} from '../Utils'

const urlFor = ({company, workspace, folder, campaign}, fragment = null) => {
  const campaignUrl = `/c/${company}/w/${workspace}/f/${folder}/c/${campaign}`

  return fragment
    ? `${campaignUrl}/edit/${fragment}`
    : campaignUrl
}

const EveryLanguage = everyCriteria('language')
const EveryLocation = everyCriteria('location')
const flattenParam = ({key, value}) => `${key}=${value}`

class AdwordsCampaign extends React.Component {
  static displayName = 'Adwords-Campaign'

  static propTypes = {
    children: PropTypes.node,
    reload: PropTypes.func,
    params: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    messages: PropTypes.object,
    router: PropTypes.object,
    location: PropTypes.object
  }

  closeModal = (reloadFirst = true) => {
    const {reload, params} = this.props
    const {router} = this.context

    const navigate = () => router.push(urlFor(params))

    if (reloadFirst) {
      return reload().then(navigate)
    }

    return navigate()
  }

  cancel = () => {
    return this.closeModal(false)
  }

  render () {
    const {reload, children, params, campaign: {status: {status}, details, name}} = this.props
    const {messages} = this.context

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

            {list({
              google_search: details.google_search,
              search_network: details.channel === 'SEARCH' || details.search_network,
              content_network: details.channel === 'DISPLAY' || details.content_network,
              partner_network: details.partner_network,
              shopping_network: details.channel === 'SHOPPING',
              multi_channel_network: details.channel === 'MULTI_CHANNEL'
            }, (active, key) => active && <Network key={key} name={key}/>)}

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

          <Info editLink={editable ? urlFor(params, 'tracking') : null}>
            <Message>trackingUrl</Message>:
            {list(
              [details.tracking_url].concat(map(details.url_params && details.url_params.parameters, flattenParam)),
              txt => txt ? <SubText>{txt}</SubText> : null
            )}
          </Info>

          <SectionTitle>
            <Message>extensions</Message>:
          </SectionTitle>

          <Section>
            <Info editLink={editable ? urlFor(params, 'site-links') : null}>
              <Message>siteLinks</Message>:
              {list(mapExtensions(details.extensions, 'SITELINK',
                ({sitelinkText, sitelinkFinalUrls: {urls}}, index) =>
                  <SubText key={index}>
                    <a className='mdl-color-text--blue-grey-500' href={head(urls)} target='_blank'>
                      {sitelinkText}
                    </a>
                  </SubText>))}
            </Info>

            <Info editLink={editable ? urlFor(params, 'call-outs') : null}>
              <Message>callOut</Message>:
              {list(mapExtensions(details.extensions, 'CALLOUT',
                ({calloutText}, index) =>
                  <SubText key={index}>
                    "{calloutText}"
                  </SubText>))}
            </Info>

            <Info editLink={editable ? urlFor(params, 'apps') : null}>
              <Message>targetApp</Message>:
              {list(mapExtensions(details.extensions, 'APP',
                ({appLinkText, appFinalUrls: {urls}}, index) =>
                  <SubText key={index}>
                    <a className='mdl-color-text--blue-grey-500' href={head(urls)} target='_blank'>
                      {appLinkText}
                    </a>
                  </SubText>))}
            </Info>
          </Section>

          <Info editLink={editable ? urlFor(params, 'user-lists') : null}>
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

          {children ? React.cloneElement(children,
            assign({}, this.props, {
              reload,
              cancel: this.cancel,
              onSubmit: this.closeModal
            })) : null}
        </Wrapper>}
      </Fence>
    )
  }
}

export default AdwordsCampaign
