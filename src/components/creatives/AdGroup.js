import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../higher-order/branch'
import {pure} from 'recompose'
import {liveEditAdGroupAction} from '../../actions/update-campaign-creatives'
import {pushAdAction} from '../../actions/create-ad'
import {pushKeywordsAction} from '../../actions/create-keyword'
import AdGroupAd from './AdGroupAd'
import AdGroupKeyword from './AdGroupKeyword'
import map from 'lodash/map'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'
import groupBy from 'lodash/groupBy'
import Message from 'tetris-iso/Message'
import upper from 'lodash/toUpper'
import CleanInput from './CleanInput'
import Modal from 'tetris-iso/Modal'
import AdGroupEdit from './AdGroupEdit'
import {Button} from '../Button'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import KeywordInsert from './KeywordInsert'
import head from 'lodash/head'
import get from 'lodash/get'
import {EditLink, EditableCreative} from './EditableCreative'
import keys from 'lodash/keys'

const editableContext = keys(EditableCreative.childContextTypes)
const style = csjs`
.header {
  font-size: large;
  font-weight: 600;
  padding: .7em 0;
  text-align: center;
}
.settingsButton {
  color: white;
  cursor: pointer;
  font-size: smaller;
  float: right;
  margin-right: .3em;
}
.newBtRow {
  text-align: center;
}`

class AdGroup_ extends React.Component {
  static displayName = 'AdGroup'

  static propTypes = {
    id: PropTypes.string.isRequired,
    status: PropTypes.string,
    searchTerms: PropTypes.array,
    name: PropTypes.string,
    ads: PropTypes.array,
    keywords: PropTypes.array,
    dispatch: PropTypes.func,
    params: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
    isOpenModal: PropTypes.func,
    closeModal: PropTypes.func,
    getQueryParam: PropTypes.func
  }

  onChange = ({target: {name, value}}) => {
    const {dispatch, params} = this.props

    dispatch(liveEditAdGroupAction, params, {[name]: value})
  }

  createAd = type => {
    const {dispatch, params} = this.props

    dispatch(pushAdAction, params, type)
  }

  createTextAd = () => {
    this.createAd('EXPANDED_TEXT_AD')
  }

  createCallOnlyAd = () => {
    this.createAd('CALL_ONLY_AD')
  }

  createProductAd = () => {
    this.createAd('PRODUCT_AD')
  }

  createKeyword = keywords => {
    this.props.dispatch(
      pushKeywordsAction,
      this.props.params,
      this.context.getQueryParam('keyword'),
      keywords
    )

    this.context.closeModal('keyword')
  }

  render () {
    const {
      dispatch,
      params,
      id,
      name,
      status,
      ads,
      keywords,
      searchTerms
    } = this.props
    const {
      editMode,
      isOpenModal,
      closeModal
    } = this.context

    const criteria = groupBy(keywords, 'criterion_use')
    const childProps = {params, dispatch, editMode}
    const firstAdUrl = head(get(head(ads), 'final_urls'))

    let color, textColor

    switch (upper(status)) {
      case 'REMOVED':
        color = 'grey-300'
        textColor = 'grey-500'
        break
      case 'PAUSED':
        color = 'grey-400'
        textColor = 'grey-700'
        break
      default:
        color = 'grey-700'
        textColor = 'white'
    }

    const headerClassName = `mdl-color--${color} mdl-color-text--${textColor} ${style.header}`

    return (
      <div>
        <header title={status} className={headerClassName}>
          {editMode
            ? <CleanInput name='name' value={name} onChange={this.onChange}/>
            : name}

          {editMode && (
            <EditLink name='adGroup' value={id} className={style.settingsButton}>
              <i className='material-icons'>
                arrow_drop_down
              </i>
            </EditLink>)}
        </header>

        {map(ads, ad =>
          <AdGroupAd
            key={ad.id}
            {...childProps}
            {...ad}/>)}

        {editMode && (
          <div className={style.newBtRow}>
            <Button className='mdl-button'>
              <Message>newAd</Message>

              <DropdownMenu>
                <MenuItem onClick={this.createTextAd}>
                  <Message>textAd</Message>
                </MenuItem>

                <MenuItem onClick={this.createCallOnlyAd}>
                  <Message>callOnlyAd</Message>
                </MenuItem>

                <MenuItem onClick={this.createProductAd}>
                  <Message>productAd</Message>
                </MenuItem>
              </DropdownMenu>
            </Button>
          </div>)}

        {editMode || criteria.BIDDABLE
          ? (
            <div>
              <h5>
                <Message>biddableKeywords</Message>
              </h5>
              {map(criteria.BIDDABLE, keyword =>
                <AdGroupKeyword
                  key={keyword.id}
                  suggestedUrl={firstAdUrl}
                  {...childProps}
                  {...keyword}/>)}
            </div>) : null}

        {editMode && (
          <div className={style.newBtRow}>
            <EditLink className='mdl-button' name='keyword' value='BIDDABLE'>
              <Message>newKeyword</Message>
            </EditLink>
          </div>)}

        {editMode || criteria.NEGATIVE
          ? (
            <div>
              <h5>
                <Message>negativeKeywords</Message>
              </h5>
              {map(criteria.NEGATIVE, keyword =>
                <AdGroupKeyword
                  key={keyword.id}
                  {...childProps}
                  {...keyword}/>)}
            </div>) : null}

        {editMode && (
          <div className={style.newBtRow}>
            <EditLink className='mdl-button' name='keyword' value='NEGATIVE'>
              <Message>newKeyword</Message>
            </EditLink>
          </div>)}

        {searchTerms
          ? (
            <div>
              <h5>
                <Message>searchTerms</Message>
              </h5>
              {map(searchTerms,
                ({query, impressions}, index) =>
                  <AdGroupKeyword
                    key={index}
                    text={query}/>)}
            </div>) : null}

        {isOpenModal('adGroup', id) && (
          <Modal
            provide={editableContext}
            onEscPress={() => closeModal('adGroup')}
            size='medium'
            minHeight={0}>
            <AdGroupEdit
              {...this.props}
              close={() => closeModal('adGroup')}
              onChange={this.onChange}/>
          </Modal>)}

        {(isOpenModal('keyword', 'BIDDABLE') || isOpenModal('keyword', 'NEGATIVE')) && (
          <Modal onEscPress={() => closeModal('keyword')} size='small' minHeight={0}>
            <KeywordInsert
              save={this.createKeyword}
              cancel={() => closeModal('keyword')}/>
          </Modal>
        )}
      </div>
    )
  }
}

export const AdGroup = styledComponent(AdGroup_, style)

const AdGroupWrapper = props => <AdGroup {...props} {...props.adGroup}/>

AdGroupWrapper.displayName = 'AdGroup'
AdGroupWrapper.propTypes = {
  adGroup: PropTypes.object
}

const level = ({params}) => params.campaign ? 'campaign' : 'folder'

export default node(level, 'adGroup', pure(AdGroupWrapper), Infinity)
