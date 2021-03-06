import React from 'react'
import Message from '@tetris/front-server/Message'
import {Submit, Button} from '../../../Button'
import Form from '../../../Form'
import PropTypes from 'prop-types'
import Checkbox from '../../../Checkbox'
import map from 'lodash/map'
import filter from 'lodash/filter'
import {loadLanguageCriteriaAction} from '../../../../actions/load-campaign-language-criteria'
import {updateCampaignLanguageAction} from '../../../../actions/update-campaign-language'
import csjs from 'csjs'
import {styledComponent} from '../../../higher-order/styled'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'

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
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
  }

  componentDidMount () {
    const {dispatch, params, folder} = this.props

    if (!folder.languageCriteria) {
      dispatch(loadLanguageCriteriaAction, params)
    }
  }

  save = e => {
    const {dispatch, params, onSubmit} = this.props
    const selected = []
    let fullSelection = true

    /**
     * @type {HTMLFormElement}
     */
    const form = e.target

    forEach(this.props.folder.languageCriteria, lang => {
      const el = form.elements[`lang-${lang.id}`]

      if (el && el.checked) {
        selected.push(lang)
      } else {
        fullSelection = false
      }
    })

    if (fullSelection) {
      selected.length = 0
    }

    return dispatch(updateCampaignLanguageAction, params, selected)
      .then(onSubmit)
  }

  getCampaignLanguages = () => {
    return filter(this.props.campaign.details.criteria, {type: 'LANGUAGE'})
  }

  selectAll = ({target}) => {
    const form = target.closest('form')

    forEach(form.elements, input => {
      if (input && input.programaticallyCheck) {
        input.programaticallyCheck()
      }
    })
  }

  render () {
    let {folder: {languageCriteria}} = this.props

    const campaignLanguages = this.getCampaignLanguages()
    const selectedLanguages = isEmpty(campaignLanguages)
      ? map(languageCriteria, 'id')
      : map(campaignLanguages, 'id')
    const isLoading = !languageCriteria

    if (isLoading) {
      languageCriteria = map(campaignLanguages, parseCampaignLang)
    }

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className={`mdl-cell mdl-cell--12-col ${style.checklist}`}>
            {map(languageCriteria, ({id, name}) =>
              <Checkbox
                key={id}
                label={name}
                name={`lang-${id}`}
                checked={includes(selectedLanguages, id)}/>)}

            {isLoading && (
              <p className={style.loading}>
                <Message>loadingLanguages</Message>
              </p>)}
          </div>
        </div>

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
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
      </Form>
    )
  }
}

export default styledComponent(EditLanguage, style)
