import React from 'react'
import Message from 'tetris-iso/Message'
import {Submit, Button} from '../../../Button'
import Form from '../../../Form'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import {loadLanguageCriteriaAction} from '../../../../actions/load-campaign-language-criteria'
import {updateCampaignDynamicSearchAdsAction} from '../../../../actions/update-campaign-dynamic-search-ads'
import {styledComponent} from '../../../higher-order/styled'
import startsWith from 'lodash/startsWith'
import Select from '../../../Select'
import Input from '../../../Input'
import {style} from '../style'
import find from 'lodash/find'

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

  static contextTypes = {
    locales: PropTypes.string
  }

  state = find(this.props.campaign.details.settings, {SettingType: 'DynamicSearchAdsSetting'}) ||
    {domainName: ''}

  componentWillMount () {
    if (!this.state.languageCode) {
      this.setState({
        languageCode: startsWith(this.context.locales, 'pt')
          ? 'pt'
          : 'en'
      })
    }
  }

  componentDidMount () {
    const {dispatch, params, folder} = this.props

    if (!folder.languageCriteria) {
      dispatch(loadLanguageCriteriaAction, params)
    }
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props

    return dispatch(updateCampaignDynamicSearchAdsAction, params, this.state)
      .then(onSubmit)
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  render () {
    const {languageCode, domainName} = this.state
    const {folder: {languageCriteria}} = this.props
    const isLoading = !languageCriteria

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              name='domainName'
              label='domainName'
              value={domainName}
              onChange={this.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              label='domainLanguage'
              name='languageCode'
              value={languageCode}
              onChange={this.onChange}>
              {map(languageCriteria, ({code, name}) =>
                <option key={code} value={code}>
                  {name}
                </option>)}
            </Select>

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

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditLanguage, style)
