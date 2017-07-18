import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Fence from '../../Fence'
import assign from 'lodash/assign'
import map from 'lodash/map'
import head from 'lodash/head'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

import {
  list,
  Wrapper,
  SubText,
  Info,
  Section,
  SectionTitle,
  mapExtensions
} from '../../campaign/Utils'

const urlFor = ({company, workspace, folder}, fragment = null) => {
  const accountUrl = `/company/${company}/workspace/${workspace}/folder/${folder}/account`

  return fragment
    ? `${accountUrl}/${fragment}`
    : accountUrl
}

const flattenParam = ({key, value}) => `${key}=${value}`

class AdwordsCampaign extends React.Component {
  static displayName = 'Adwords-Campaign'

  static propTypes = {
    children: PropTypes.node,
    reload: PropTypes.func,
    params: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
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
    const {reload, children, params, account: {details, name}} = this.props

    return (
      <Fence canEditFolder>{({canEditFolder: editable}) =>
        <Wrapper>
          <Info disabled>
            <Message>nameLabel</Message>:
            <SubText>{name}</SubText>
          </Info>

          <Info editLink={editable ? urlFor(params, 'tracking') : null}>
            <Message>trackingUrl</Message>:
            {list([details.tracking_url]
                .concat(map(details.url_params &&
                  details.url_params.parameters, flattenParam)),
              txt => txt
                ? <SubText>{txt}</SubText>
                : null)}
          </Info>

          <Info editLink={editable ? urlFor(params, 'conversion-trackers') : null}>
            <Message>conversionTracker</Message>:
            {list(details.conversionTrackers, ({id, name}) =>
              <SubText key={id}>{name}</SubText>)}
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

            {!isEmpty(details.locationFeeds) && (
              <Info editLink={editable ? urlFor(params, 'locations') : null}>
                <Message>feedLocal</Message>:
                {list(filter(details.locations, 'businessName'), ({feedItemId, businessName}) =>
                  <SubText key={feedItemId}>{businessName}</SubText>)}
              </Info>)}

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
