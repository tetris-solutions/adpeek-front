import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import map from 'lodash/map'
import {style, withPreview, kpiType, DestinationUrl, KPI} from './AdUtils'
import {findTemplateAdId, findTemplateAdUrl} from '../../functions/find-template-ad-url'
import {loadBundlePreviewUrlAction} from '../../actions/load-bundle-preview-url'

let TemplatePreview = ({url, previewMode, setPreviewMode}) => (
  <div className={style.templatePreview}>
    <iframe src={url} frameBorder={0} height={200}/>
    <div className={style.templatePreviewOverlay} onClick={() => setPreviewMode(true)}>{previewMode && (
      <Modal onEscPress={() => setPreviewMode(false)}>
        <div className={style.templatePreviewModal}>
          <iframe src={url} frameBorder={0} height={300} className={style.templatePreviewIframe}/>
        </div>
      </Modal>)}
    </div>
  </div>
)

TemplatePreview.displayName = 'Template-Preview'
TemplatePreview.propTypes = {
  url: PropTypes.string,
  previewMode: PropTypes.bool,
  setPreviewMode: PropTypes.func
}
TemplatePreview = withPreview(TemplatePreview)

const TemplateLink = ({url}) => (
  <a className={style.link} href={url || ''} target='_blank'>
    {url || 'invalid template'}
  </a>
)

TemplateLink.displayName = 'Template-Link'
TemplateLink.propTypes = {
  url: PropTypes.string
}

class TemplateAd extends React.Component {
  static displayName = 'Template-Ad'

  static propTypes = {
    id: PropTypes.string,
    adgroup_id: PropTypes.string,
    final_urls: PropTypes.array,
    kpi: kpiType,
    urls: PropTypes.array,
    preview: PropTypes.shape({
      url: PropTypes.string
    })
  }

  static contextTypes = {
    tree: PropTypes.object,
    params: PropTypes.object
  }

  componentDidMount () {
    const {tree, params} = this.context
    const {urls, id, adgroup_id} = this.props
    const bundleId = findTemplateAdId(urls)

    if (bundleId) {
      loadBundlePreviewUrlAction(tree, params, adgroup_id, id, bundleId)
    }
  }

  render () {
    const {kpi, preview, final_urls, urls} = this.props

    return (
      <div className={style.wrapper}>
        <div className={`mdl-color--yellow-200 ${style.box}`}>
          {kpi && <KPI kpi={kpi}/>}
          {preview
            ? <TemplatePreview url={preview.url}/>
            : <TemplateLink url={findTemplateAdUrl(urls)}/>}
        </div>
        {map(final_urls, (url, index) =>
          <DestinationUrl key={index} url={url}/>)}
      </div>
    )
  }
}

export default TemplateAd
