import omit from 'lodash/omit'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'
import filter from 'lodash/filter'
import map from 'lodash/map'
import curry from 'lodash/curry'
import join from 'lodash/join'

const excluded = [
  'account_id',
  'account_name',
  'accountcurrencycode',
  'accountdescriptivename',
  'accounttimezoneid',
  'activeviewcpm',
  'activeviewctr',
  'activeviewimpressions',
  'activeviewmeasurability',
  'activeviewmeasurablecost',
  'activeviewmeasurableimpressions',
  'activeviewviewability',
  'ad_id',
  'adgroupid',
  'adset_id',
  'advertiserexperimentsegmentationbin',
  'advertisingchannelsubtype',
  'advertisingchanneltype',
  'app_custom_event.fb_mobile_add_payment_info',
  'app_custom_event.fb_mobile_add_to_cart',
  'app_custom_event.fb_mobile_add_to_wishlist',
  'app_custom_event.fb_mobile_complete_registration',
  'app_custom_event.fb_mobile_complete_registration',
  'app_custom_event.fb_mobile_initiated_checkout',
  'app_custom_event.fb_mobile_level_achieved',
  'app_custom_event.fb_mobile_purchase',
  'app_custom_event.fb_mobile_rate',
  'app_custom_event.fb_mobile_search',
  'app_custom_event.fb_mobile_spent_credits',
  'app_custom_event.fb_mobile_tutorial_completion',
  'app_custom_event.other',
  'app_use',
  'baseadgroupid',
  'basecampaignid',
  'biddingstrategyid',
  'biddingstrategyname',
  'biddingstrategysource',
  'biddingstrategytype',
  'bidtype',
  'budgetid',
  'campaign_id',
  'campaignid',
  'canmanageclients',
  'clickconversionratesignificance',
  'clicksignificance',
  'conversiontrackerid',
  'convertedclickssignificance',
  'costperconvertedclicksignificance',
  'costsignificance',
  'cpcsignificance',
  'cpmsignificance',
  'creativedestinationurl',
  'creativefinalappurls',
  'creativefinalmobileurls',
  'creativefinalurls',
  'creativetrackingurltemplate',
  'criteria',
  'criteriadestinationurl',
  'ctrsignificance',
  'customerdescriptivename',
  'date_stop',
  'description',
  'description1',
  'description2',
  'desktopbidmodifier',
  'displayurl',
  'enddate',
  'enhancedcpcenabled',
  'enhancedcpvenabled',
  'externalcustomerid',
  'finalappurls',
  'finalmobileurls',
  'finalurls',
  'follow',
  'games.plays',
  'gift_sale',
  'headline',
  'headlinepart1',
  'headlinepart2',
  'imageadurl',
  'imagecreativeimageheight',
  'imagecreativeimagewidth',
  'imagecreativename',
  'impressionsignificance',
  'isautotaggingenabled',
  'isbudgetexplicitlyshared',
  'istestaccount',
  'labelids',
  'longheadline',
  'mobilebidmodifier',
  'name',
  'offsite_conversion.add_to_cart',
  'offsite_conversion.checkout',
  'offsite_conversion.key_page_view',
  'offsite_conversion.lead',
  'offsite_conversion.other',
  'offsite_conversion.registration',
  'path1',
  'path2',
  'period',
  'photo_view',
  'place_page_id',
  'place_page_name',
  'positionsignificance',
  'primarycompanyname',
  'product_id',
  'servingstatus',
  'shortheadline',
  'startdate',
  'tabletbidmodifier',
  'trackingurltemplate',
  'trialtype',
  'urlcustomparameters',
  'viewthroughconversionssignificance'
]

function loadReportMetaData (platform, entity, config) {
  return GET(`${process.env.NUMBERS_API_URL}/meta?platform=${platform}&entity=${entity}`, config)
}

function loadCrossPlatformMetaData (platforms, entity, config) {
  return GET(`${process.env.NUMBERS_API_URL}/x/meta?platforms=${join(platforms, ',')}&entity=${entity}`, config)
}

const saveMetaData = curry((tree, platform, entity, response) => {
  const attributes = omit(response.data, excluded)

  if (attributes.id) {
    const entityNameMessage = `${entity[0].toLowerCase() + entity.slice(1)}Entity`
    attributes.id.name = tree.get(['intl', 'messages', entityNameMessage])
  }

  const metaData = {
    attributes,
    dimensions: map(filter(attributes, 'is_dimension'), 'id'),
    metrics: map(filter(attributes, 'is_metric'), 'id')
  }

  tree.set(platform
      ? ['reportMetaData', platform, entity]
      : ['reportMetaData', '_', entity],
    metaData)

  tree.commit()

  return response
})

export function loadReportMetaDataAction (tree, platform, entity, token) {
  return loadReportMetaData(platform, entity, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveMetaData(tree, platform, entity))
    .catch(pushResponseErrorToState(tree))
}

export function loadCrossPlatformReportMetaDataAction (tree, platforms, entity, token) {
  return loadCrossPlatformMetaData(platforms, entity, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveMetaData(tree, null, entity))
    .catch(pushResponseErrorToState(tree))
}
