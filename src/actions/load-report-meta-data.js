import omit from 'lodash/omit'
import set from 'lodash/set'
import without from 'lodash/without'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {GET} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function loadReportMetaData (platform, entity, config) {
  return GET(`${process.env.NUMBERS_API_URL}/meta?platform=${platform}&entity=${entity}`, config)
}

const excluded = [
  'name',
  'date_stop',
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
  'advertiserexperimentsegmentationbin',
  'advertisingchannelsubtype',
  'advertisingchanneltype',
  'basecampaignid',
  'bidtype',
  'biddingstrategyid',
  'biddingstrategyname',
  'biddingstrategytype',
  'budgetid',
  'desktopbidmodifier',
  'mobilebidmodifier',
  'tabletbidmodifier',
  'trialtype',
  'canmanageclients',
  'clickconversionratesignificance',
  'clicksignificance',
  'conversiontrackerid',
  'convertedclickssignificance',
  'costperconvertedclicksignificance',
  'costsignificance',
  'cpcsignificance',
  'cpmsignificance',
  'ctrsignificance',
  'customerdescriptivename',
  'enddate',
  'enhancedcpcenabled',
  'enhancedcpvenabled',
  'externalcustomerid',
  'impressionsignificance',
  'isautotaggingenabled',
  'isbudgetexplicitlyshared',
  'istestaccount',
  'labelids',
  'period',
  'positionsignificance',
  'primarycompanyname',
  'servingstatus',
  'startdate',
  'trackingurltemplate',
  'urlcustomparameters',
  'viewthroughconversionssignificance',
  'account_id',
  'account_name',
  'ad_id',
  'adset_id',
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
  'campaign_id',
  'follow',
  'games.plays',
  'gift_sale',
  'offsite_conversion.add_to_cart',
  'offsite_conversion.checkout',
  'offsite_conversion.key_page_view',
  'offsite_conversion.lead',
  'offsite_conversion.other',
  'offsite_conversion.registration',
  'photo_view',
  'place_page_id',
  'place_page_name',
  'product_id',
  // ad fields
  'headline',
  'creativefinalappurls',
  'description',
  'description1',
  'description2',
  'creativedestinationurl',
  'displayurl',
  'creativefinalurls',
  'headlinepart1',
  'headlinepart2',
  'imageadurl',
  'imagecreativeimageheight',
  'imagecreativeimagewidth',
  'imagecreativename',
  'longheadline',
  'creativefinalmobileurls',
  'path1',
  'path2',
  'shortheadline',
  'creativetrackingurltemplate',
  // keyword
  'criteria'
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
    .then(response => {
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
