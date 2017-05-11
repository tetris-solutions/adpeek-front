import React from 'react'
import Message from 'tetris-iso/Message'
import {Submit} from '../../Button'
import PropTypes from 'prop-types'
import loglevel from 'loglevel'
import Checkbox from '../../Checkbox'
import map from 'lodash/map'
import filter from 'lodash/filter'
import noop from 'lodash/noop'
import keyBy from 'lodash/keyBy'
import {loadLanguageCriteriaAction} from '../../../actions/load-campaign-language-criteria'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import forEach from 'lodash/forEach'

const style = csjs`
.checklist {
  height: 300px;
  overflow-y: auto;
}
.actions {
  text-align: right
}
.loading {
  margin-top: 2em;
  font-style: italic;
}`

const parseCampaignLang = ({id, language: name, language_code: code}) => ({id, name, code})

class EditLanguage extends React.Component {
  static displayName = 'Edit-Language'

  static propTypes = {
    campaign: PropTypes.object,
    folder: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func
  }

  static defaultProps = {
    onSubmit: noop
  }

  componentDidMount () {
    const {dispatch, params, folder} = this.props

    if (!folder.languageCriteria) {
      dispatch(loadLanguageCriteriaAction, params)
    }
  }

  onSubmit = e => {
    e.preventDefault()

    const selected = []

    /**
     * @type {HTMLFormElement}
     */
    const form = e.target

    forEach(this.props.folder.languageCriteria, lang => {
      const el = form.elements[`lang-${lang.id}`]

      if (el && el.checked) {
        selected.push(lang)
      }
    })

    loglevel.info(selected)
  }

  getCampaignLanguages = () => {
    return filter(this.props.campaign.details.criteria, {type: 'LANGUAGE'})
  }

  render () {
    let {folder: {languageCriteria}} = this.props

    const campaignLanguages = this.getCampaignLanguages()
    const selectedLanguages = keyBy(campaignLanguages, 'id')
    const isLoading = !languageCriteria

    if (isLoading) {
      languageCriteria = map(campaignLanguages, parseCampaignLang)
    }

    return (
      <form onSubmit={this.onSubmit}>
        <div className='mdl-grid'>
          <div className={`mdl-cell mdl-cell--12-col ${style.checklist}`}>
            {map(languageCriteria, ({id, name}) =>
              <Checkbox
                key={id}
                label={name}
                name={`lang-${id}`}
                checked={Boolean(selectedLanguages[id])}/>)}

            {isLoading && (
              <p className={`${style.loading}`}>
                <Message>loadingLanguages</Message>
              </p>)}
          </div>
        </div>

        <div className={`${style.actions}`}>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </form>
    )
  }
}

export default styledComponent(EditLanguage, style)
