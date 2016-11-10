import cx from 'classnames'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import isEmpty from 'lodash/isEmpty'
import lowerCase from 'lodash/toLower'
import sortBy from 'lodash/sortBy'
import trim from 'lodash/trim'
import React from 'react'
import AttributesSelect from './AttributesSelect'
import EntityTree from './EntityTree'
import Input from '../../../Input'
import {Tabs, Tab} from '../../../Tabs'

const {PropTypes} = React
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

const Lists = React.createClass({
  displayName: 'Lists',
  propTypes: {},
  contextTypes: {
    messages: PropTypes.object,
    selectable: PropTypes.object,
    draft: PropTypes.object,
    addAttribute: PropTypes.func.isRequired,
    removeAttribute: PropTypes.func.isRequired
  },
  getInitialState () {
    return {searchValue: ''}
  },
  componentWillMount () {
    this.onChangeSearch = debounce(this.onChangeSearch, 300)
  },
  onChangeSearch () {
    const input = this.refs.wrapper.querySelector('input[name="searchValue"]')
    this.setState({searchValue: input.value})
  },
  render () {
    const {searchValue} = this.state
    const {messages, draft, addAttribute, removeAttribute} = this.context

    const selectable = sorted(matching(this.context.selectable, searchValue))
    const items = sorted(matching(draft.entity.list, searchValue))
    const dimensions = filter(selectable, 'is_dimension')
    const metrics = filter(selectable, 'is_metric')

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

    return (
      <div ref='wrapper'>
        <Input
          label='filter'
          name='searchValue'
          onChange={this.onChangeSearch}/>

        <Tabs onChangeTab={this.onChangeTab}>
          <Tab id='entity' title={entityTitle}>
            <br/>
            <EntityTree items={items}/>
          </Tab>

          <Tab id='metric' title={metricTitle}>
            <br/>
            <AttributesSelect
              add={addAttribute}
              remove={removeAttribute}
              attributes={metrics}
              selectedAttributes={selectedMetrics}/>
          </Tab>

          {draft.module.type !== 'total' && (
            <Tab id='dimension' title={dimensionTitle}>
              <br/>
              <AttributesSelect
                add={addAttribute}
                remove={removeAttribute}
                attributes={dimensions}
                selectedAttributes={selectedDimensions}/>
            </Tab>)}
        </Tabs>
      </div>
    )
  }
})

export default Lists
