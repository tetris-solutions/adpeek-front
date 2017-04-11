import cx from 'classnames'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import isEmpty from 'lodash/isEmpty'
import lowerCase from 'lodash/toLower'
import sortBy from 'lodash/sortBy'
import trim from 'lodash/trim'
import head from 'lodash/head'
import split from 'lodash/split'
import React from 'react'
import PropTypes from 'prop-types'
import AttributeList from './AttributeList'
import Input from '../../../Input'
import {Tabs, Tab} from '../../../Tabs'
import Entities from './Entities'
import MissingIdAlert from './MissingIdAlert'

const clean = str => trim(lowerCase(deburr(str)))

const containsSearchvalue = searchValue =>
  ({name, headline, description}) => (
    includes(clean(name), searchValue) ||
    includes(clean(description), searchValue) ||
    includes(clean(headline), searchValue)
  )

const matching = (ls, searchValue) => searchValue
  ? filter(ls, containsSearchvalue(searchValue))
  : ls

const sorted = ls => sortBy(ls, 'name')

class Lists extends React.Component {
  static displayName = 'Lists'

  static contextTypes = {
    report: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    selectable: PropTypes.object.isRequired,
    draft: PropTypes.object.isRequired,
    addAttribute: PropTypes.func.isRequired,
    removeAttribute: PropTypes.func.isRequired
  }

  state = {searchValue: ''}

  componentWillMount () {
    this.onChangeSearch = debounce(this.onChangeSearch, 300)
  }

  onChangeSearch = () => {
    const input = this.refs.wrapper.querySelector('input[name="searchValue"]')
    this.setState({searchValue: input.value})
  }

  attributeLevels = () => {
    const {messages, report} = this.context

    return report.platform
      ? undefined
      : [{
        id: 'platform',
        openByDefault: true,
        mount ({id}) {
          const shared = !includes(id, ':')
          const platform = shared
            ? 'shared'
            : head(split(id, ':'))

          return {
            id: platform,
            shared,
            name: messages[platform + 'Level']
          }
        }
      }]
  }

  render () {
    const {searchValue} = this.state
    const {report, messages, draft, addAttribute, removeAttribute} = this.context

    const selectable = sorted(matching(this.context.selectable, clean(searchValue)))
    const items = sorted(matching(draft.entity.list, clean(searchValue)))
    const dimensions = filter(selectable, 'is_dimension')
    const metrics = filter(selectable, 'is_metric')
    const attrLevels = this.attributeLevels()

    const selectedMetrics = draft.module.metrics
    const selectedDimensions = draft.module.dimensions
    const selectedIds = draft.module.filters.id

    const entityClasses = cx('material-icons', isEmpty(selectedIds) && 'mdl-color-text--red-A700')
    const entityTitle = (
      <i className={entityClasses} title={draft.entity.name}>list</i>
    )

    const metricClasses = cx('material-icons', isEmpty(selectedMetrics) && 'mdl-color-text--red-A700')
    const metricTitle = (
      <i className={metricClasses} title={messages.metrics}>trending_up</i>
    )

    const dimensionClasses = cx('material-icons', isEmpty(selectedDimensions) && 'mdl-color-text--red-A700')
    const dimensionTitle = (
      <i className={dimensionClasses} title={messages.dimensions}>view_column</i>
    )
    const missingId = !includes(selectedDimensions, 'id')
    const isAnalytics = report.platform === 'analytics'
    const isTotalType = draft.module.type === 'total'

    return (
      <div ref='wrapper'>
        <Input
          label='filter'
          name='searchValue'
          onChange={this.onChangeSearch}/>

        <Tabs onChangeTab={this.onChangeTab}>
          {!isAnalytics && (
            <Tab id='entity' title={entityTitle}>
              <br/>
              <Entities items={items}/>
            </Tab>)}

          {!isTotalType && (
            <Tab id='dimension' title={dimensionTitle}>
              <br/>

              {missingId && !isAnalytics && (
                <MissingIdAlert add={() => addAttribute('id')}/>)}

              <AttributeList
                add={addAttribute}
                remove={removeAttribute}
                attributes={dimensions}
                levels={attrLevels}
                selectedAttributes={selectedDimensions}/>
            </Tab>)}

          <Tab id='metric' title={metricTitle}>
            <br/>

            {!isTotalType && !isAnalytics && missingId && (
              <MissingIdAlert add={() => addAttribute('id')}/>)}

            <AttributeList
              add={addAttribute}
              remove={removeAttribute}
              attributes={metrics}
              levels={attrLevels}
              selectedAttributes={selectedMetrics}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default Lists
