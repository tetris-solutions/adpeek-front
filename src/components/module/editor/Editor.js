import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import Message from '@tetris/front-server/Message'
import DateRangeButton from '../../report/DateRangeButton'
import Lists from './Lists'
import Description from './Description'
import Filters from './Filters'
import Preview from './Preview'
import {Tabs, Tab} from '../../Tabs'
import {styledComponent} from '../../higher-order/styled'
import pick from 'lodash/pick'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import diff from 'lodash/difference'
import forEach from 'lodash/forEach'
import size from 'lodash/size'
import {Button} from '../../Button'

const style = csjs`
.leftCol {
  height: calc(80vh + 40px);
  overflow-y: auto;
}
.rightButtons {
  float: right;
  margin-right: 1em
}`

class Editor extends React.Component {
  static displayName = 'Editor'

  static contextTypes = {
    draft: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired
  }

  static propTypes = {
    remove: PropTypes.func.isRequired,
    entities: PropTypes.object.isRequired,
    invalidPermutation: PropTypes.array,
    maxAccounts: PropTypes.number.isRequired,
    numberOfSelectedAccounts: PropTypes.number.isRequired,
    isInvalid: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    gaAttributesLimit: PropTypes.shape({
      metrics: PropTypes.shape({
        max: PropTypes.number,
        selected: PropTypes.number
      }),
      dimensions: PropTypes.shape({
        max: PropTypes.number,
        selected: PropTypes.number
      })
    }),
    save: PropTypes.func.isRequired,
    redraw: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
  }

  static childContextTypes = {
    selectable: PropTypes.object
  }

  getChildContext () {
    const {attributes, draft} = this.context
    const selected = pick(attributes, concat(draft.module.dimensions, draft.module.metrics))
    const selectable = {}
    const isIdSelected = selected.id || size(draft.module.filters.id) === 1

    forEach(attributes, (attr, key) => {
      const isAvailable = selected[key] || (
        (
          !attr.requires_id || isIdSelected
        ) && (
          !attr.pairs_with || isEmpty(diff(map(filter(selected, 'is_breakdown'), 'id'), attr.pairs_with))
        )
      )

      if (isAvailable) {
        selectable[key] = attr
      }
    })

    return {selectable}
  }

  render () {
    const {
      entities,
      isLoading,
      isInvalid,
      maxAccounts,
      invalidPermutation,
      numberOfSelectedAccounts,
      gaAttributesLimit,
      redraw,
      save,
      cancel,
      remove
    } = this.props
    const {messages, draft} = this.context
    const selectedTooManyAccounts = numberOfSelectedAccounts > maxAccounts
    let updateBt

    if (isInvalid) {
      updateBt = (
        <em className='mdl-color-text--red-A700'>
          <Message entity={draft.entity.name}>invalidModuleConfig</Message>
        </em>
      )
    } else if (selectedTooManyAccounts) {
      updateBt = (
        <em className='mdl-color-text--red-A700'>
          <Message selected={String(numberOfSelectedAccounts)} max={String(maxAccounts)}>
            tooManyAccounts
          </Message>
        </em>
      )
    } else if (invalidPermutation) {
      updateBt = (
        <em className='mdl-color-text--red-A700'>
          <Message first={invalidPermutation[0].name} second={invalidPermutation[1].name} html>
            invalidPermutation
          </Message>
        </em>
      )
    } else if (gaAttributesLimit.dimensions.selected > gaAttributesLimit.dimensions.max) {
      updateBt = (
        <em className='mdl-color-text--red-A700'>
          <Message selected={gaAttributesLimit.dimensions.selected} limit={gaAttributesLimit.dimensions.max} html>
            tooManyDimensions
          </Message>
        </em>
      )
    } else if (gaAttributesLimit.metrics.selected > gaAttributesLimit.metrics.max) {
      updateBt = (
        <em className='mdl-color-text--red-A700'>
          <Message selected={gaAttributesLimit.metrics.selected} limit={gaAttributesLimit.metrics.max} html>
            tooManyMetrics
          </Message>
        </em>
      )
    } else {
      updateBt = (
        <Button disabled={isLoading} className='mdl-button' onClick={redraw}>
          <Message>update</Message>
        </Button>
      )
    }

    return (
      <div>
        <form className='mdl-grid'>
          <div className={`mdl-cell mdl-cell--3-col ${style.leftCol}`}>
            <Lists entities={entities}/>
          </div>
          <div className='mdl-cell mdl-cell--9-col'>
            <Tabs>
              <Tab id='module-content' title={messages.moduleContent}>
                <Preview entities={entities}/>
              </Tab>
              <Tab id='module-description' title={messages.moduleDescriptionTitle}>
                <Description/>
              </Tab>
              <Tab id='module-filters' title={messages.filterModuleResult}>
                <Filters/>
              </Tab>
            </Tabs>
          </div>
        </form>

        <a className='mdl-button' onClick={draft.module.blank ? remove : cancel}>
          <Message>cancel</Message>
        </a>

        <Button disabled={isInvalid || selectedTooManyAccounts} className='mdl-button' onClick={save}>
          <Message>save</Message>
        </Button>

        <span className={style.rightButtons}>
          {updateBt}
          <DateRangeButton className='mdl-button'/>
        </span>
      </div>
    )
  }
}

export default styledComponent(Editor, style)
