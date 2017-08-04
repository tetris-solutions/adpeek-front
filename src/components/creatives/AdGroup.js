import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../higher-order/branch'
import {pure} from 'recompose'
import {liveEditAdGroupAction} from '../../actions/update-campaign-creatives'
import {pushAdAction} from '../../actions/create-ad'
import {pushKeywordsAction} from '../../actions/create-keyword'
import endsWith from 'lodash/endsWith'
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
    status: PropTypes.string,
    searchTerms: PropTypes.array,
    name: PropTypes.string,
    ads: PropTypes.array,
    keywords: PropTypes.array,
    dispatch: PropTypes.func,
    params: PropTypes.object
  }

  static contextTypes = {
    location: PropTypes.object
  }

  state = {
    modalOpen: false,
    keywordCreateMode: null
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
      this.state.keywordCreateMode,
      keywords
    )

    this.closeKeywordCreationModal()
  }

  closeKeywordCreationModal = () => {
    this.setState({keywordCreateMode: null})
  }

  createBiddableKeyword = () => {
    this.setState({keywordCreateMode: 'BIDDABLE'})
  }

  createNegativeKeyword = () => {
    this.setState({keywordCreateMode: 'NEGATIVE'})
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render () {
    const {modalOpen, keywordCreateMode} = this.state
    const editMode = endsWith(this.context.location.pathname, '/edit')
    const {dispatch, params, name, status, ads, keywords, searchTerms} = this.props
    const criterions = groupBy(keywords, 'criterion_use')
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
            <a className={style.settingsButton} onClick={this.toggleModal}>
              <i className='material-icons'>
                arrow_drop_down
              </i>
            </a>)}
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

        {editMode || criterions.BIDDABLE
          ? (
            <div>
              <h5>
                <Message>biddableKeywords</Message>
              </h5>
              {map(criterions.BIDDABLE, keyword =>
                <AdGroupKeyword
                  key={keyword.id}
                  suggestedUrl={firstAdUrl}
                  {...childProps}
                  {...keyword}/>)}
            </div>) : null}

        {editMode && (
          <div className={style.newBtRow}>
            <Button className='mdl-button' onClick={this.createBiddableKeyword}>
              <Message>newKeyword</Message>
            </Button>
          </div>)}

        {editMode || criterions.NEGATIVE
          ? (
            <div>
              <h5>
                <Message>negativeKeywords</Message>
              </h5>
              {map(criterions.NEGATIVE, keyword =>
                <AdGroupKeyword
                  key={keyword.id}
                  {...childProps}
                  {...keyword}/>)}
            </div>) : null}

        {editMode && (
          <div className={style.newBtRow}>
            <Button className='mdl-button' onClick={this.createNegativeKeyword}>
              <Message>newKeyword</Message>
            </Button>
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

        {modalOpen && (
          <Modal onEscPress={this.toggleModal} size='medium' minHeight={0}>
            <AdGroupEdit
              {...this.props}
              close={this.toggleModal}
              onChange={this.onChange}/>
          </Modal>)}

        {keywordCreateMode && (
          <Modal onEscPress={this.closeKeywordCreationModal} size='small' minHeight={0}>
            <KeywordInsert
              save={this.createKeyword}
              cancel={this.closeKeywordCreationModal}/>
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
