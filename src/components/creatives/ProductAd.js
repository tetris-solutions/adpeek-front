import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import {style, KPI, kpiType} from './AdUtils'
import {liveEditAdAction, removeAdAction} from '../../actions/update-campaign-creatives'
import AdEdit from './AdEdit'
import assign from 'lodash/assign'
import {EditLink} from './EditableCreative'

const statusIcon = {
  ENABLED: 'play_arrow',
  PAUSED: 'pause',
  DISABLED: 'remove'
}

class ProductAdAd extends React.PureComponent {
  static displayName = 'Product-Ad'
  static propTypes = {
    editMode: PropTypes.bool,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    kpi: kpiType,
    id: PropTypes.string,
    draft: PropTypes.bool
  }

  static contextTypes = {
    editMode: PropTypes.bool,
    isOpenModal: PropTypes.func,
    closeModal: PropTypes.func
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params, id, draft} = this.props
    const update = {}

    if (name === 'status' && value === 'DISABLED' && draft) {
      dispatch(removeAdAction,
        assign({ad: id}, params))
      return
    }

    if (name === 'final_urls') {
      update.final_urls = [value]
    } else {
      update[name] = value
    }

    dispatch(liveEditAdAction,
      assign({ad: id}, params),
      update)
  }

  render () {
    const {editMode, isOpenModal, closeModal} = this.context
    const ad = this.props

    return (
      <div className={style.wrapper}>
        <div className={`mdl-color--yellow-200 ${style.box}`}>
          <h5 className={style.productAd}>
            <i className='material-icons'>
              shopping_cart
            </i>
            <br/>
            <Message>productAd</Message>
          </h5>

          {ad.kpi && <KPI kpi={ad.kpi}/>}

          {editMode && (
            <EditLink
              name='ad'
              value={ad.id}
              className={`${style.editLink} mdl-color-text--grey-700`}
              title={ad.status}
              onClick={this.toggleModal}>
              <i className='material-icons'>{statusIcon[ad.status]}</i>
            </EditLink>)}
        </div>

        {isOpenModal('ad', ad.id) && (
          <Modal size='small' minHeight={0} onEscPress={() => closeModal('ad')}>
            <AdEdit
              close={() => closeModal('ad')}
              name={<Message>productAd</Message>}
              status={ad.status}
              onChange={this.onChange}/>
          </Modal>)}
      </div>
    )
  }
}

export default ProductAdAd
