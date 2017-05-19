import React from 'react'
import Message from 'tetris-iso/Message'
import {Submit, Button} from '../../Button'
import PropTypes from 'prop-types'
import Checkbox from '../../Checkbox'
import map from 'lodash/map'
import filter from 'lodash/filter'
import noop from 'lodash/noop'
import keyBy from 'lodash/keyBy'
import {loadLanguageCriteriaAction} from '../../../actions/load-campaign-language-criteria'
import {updateCampaignLanguageAction} from '../../../actions/update-campaign-language'
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
}
.actions > button:first-child {
  float: left;
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

    const {dispatch, params, onSubmit} = this.props
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

    dispatch(updateCampaignLanguageAction, params, selected)
      .then(onSubmit)
  }

  getCampaignLanguages = () => {
    return filter(this.props.campaign.details.criteria, {type: 'LANGUAGE'})
  }

  selectAll = () => {
    forEach(this.refs.form.elements, input => {
      if (input && input.programaticallyCheck) {
        input.programaticallyCheck()
      }
    })
  }

  cancel = () => {
    this.props.onSubmit(false)
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
      <form onSubmit={this.onSubmit} ref='form'>
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
          <Button className='mdl-button mdl-button--raised' onClick={this.cancel}>
            <Message>cancel</Message>
          </Button>

          <Button onClick={this.selectAll} className='mdl-button mdl-button--raised'>
            <Message>selectAll</Message>
          </Button>
          {' '}
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </form>
    )
  }
}

export default styledComponent(EditLanguage, style)
