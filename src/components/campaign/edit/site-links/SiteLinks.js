import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import filter from 'lodash/filter'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import concat from 'lodash/concat'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../../higher-order/styled'
import head from 'lodash/head'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}`

const unwrap = extensions => flatten(map(filter(extensions, {type: 'SITELINK'}), 'extensions'))

class EditSiteLinks extends React.Component {
  static displayName = 'Edit-Site-Links'

  static propTypes = {
    cancel: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    campaign: PropTypes.object
  }

  state = {
    selected: map(unwrap(this.props.campaign.details.extension), 'feedItemId')
  }

  save = () => {
    return Promise.resolve()
  }

  render () {
    const ls = concat(unwrap(this.props.campaign.details.extension))

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            {map(ls, ({feedItemId, sitelinkLine2, sitelinkLine3, sitelinkText, sitelinkFinalUrls: {urls}}) =>
              <div key={feedItemId} className='mdl-list__item mdl-list__item--three-line'>
                <div className='mdl-list__item-primary-content'>
                  <a href={head(urls)} target='_blank'>
                    {sitelinkText}
                  </a>
                  <div className='mdl-list__item-text-body'>
                    {sitelinkLine2}
                    <br/>
                    {sitelinkLine3}
                  </div>
                </div>
              </div>)}
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

export default styledComponent(EditSiteLinks, style)
