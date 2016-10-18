import omit from 'lodash/omit'
import set from 'lodash/set'
import without from 'lodash/without'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function loadReportMetaData (platform, entity, config) {
  return GET(`${process.env.NUMBERS_API_URL}/meta?platform=${platform}&entity=${entity}`, config)
}

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

export function loadReportMetaDataAction (tree, params, platform, entity, token) {
  const pathToReport = getDeepCursor(tree, [
    'user',
    ['companies', params.company],
    ['workspaces', params.workspace],
    ['folders', params.folder],
    ['reports', params.report],
    'metaData',
    platform,
    entity
  ])

  return loadReportMetaData(platform, entity, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      const metaData = response.data
      const entityNameMessage = `${entity[0].toLowerCase() + entity.slice(1)}Entity`

      metaData.attributes = omit(metaData.attributes, excluded)

      set(metaData, 'attributes.id.name',
        tree.get(['intl', 'messages', entityNameMessage]))

      metaData.dimensions = without(metaData.dimensions, excluded)

      tree.set(pathToReport, metaData)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
